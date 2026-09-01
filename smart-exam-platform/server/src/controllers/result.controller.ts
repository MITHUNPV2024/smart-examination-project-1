import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
import { RevaluationStatus } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export class ResultController {
  /**
   * Helper: Calculate Alphabetical Grade and Grade Points based on Marks
   */
  private static calculateGrade(percentage: number): { grade: string; gradePoints: number } {
    if (percentage >= 90) return { grade: 'O', gradePoints: 10.0 };
    if (percentage >= 80) return { grade: 'A+', gradePoints: 9.0 };
    if (percentage >= 70) return { grade: 'A', gradePoints: 8.0 };
    if (percentage >= 60) return { grade: 'B+', gradePoints: 7.0 };
    if (percentage >= 50) return { grade: 'B', gradePoints: 6.0 };
    if (percentage >= 40) return { grade: 'C', gradePoints: 5.0 };
    return { grade: 'F', gradePoints: 0.0 };
  }

  /**
   * Process results for all students in an exam session
   */
  public static async processResults(req: Request, res: Response, next: NextFunction) {
    try {
      const { examId } = req.body;

      const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: { schedules: { include: { subject: true } } },
      });

      if (!exam) {
        throw new NotFoundError('Exam session not found');
      }

      const resultsProcessed = [];

      for (const schedule of exam.schedules) {
        // Find all evaluations completed for this exam schedule
        const evaluations = await prisma.evaluation.findMany({
          where: {
            answerScript: { examScheduleId: schedule.id },
            isCompleted: true,
          },
          include: { answerScript: true },
        });

        for (const evalRecord of evaluations) {
          const studentId = evalRecord.answerScript.studentId;

          // 1. Simulating retrieval of internal assessment marks (default to 40 out of 50 if missing)
          const internalMarks = 40; 
          const externalMarks = evalRecord.marksObtained; // final exam score
          
          // Max marks for schedule (e.g. 100 max: 50 internal + 50 final)
          const totalMarks = internalMarks + externalMarks;
          const maxMarksCombined = 50 + schedule.maxMarks; // total achievable

          const percentage = (totalMarks / maxMarksCombined) * 100;
          const { grade, gradePoints } = ResultController.calculateGrade(percentage);
          const status = grade === 'F' ? 'FAIL' : 'PASS';

          // 2. Save result record
          const result = await prisma.result.upsert({
            where: {
              studentId_subjectId_examId: {
                studentId,
                subjectId: schedule.subjectId,
                examId,
              },
            },
            update: {
              internalMarks,
              externalMarks,
              totalMarks,
              grade,
              gradePoints,
              status,
            },
            create: {
              studentId,
              subjectId: schedule.subjectId,
              examId,
              internalMarks,
              externalMarks,
              totalMarks,
              grade,
              gradePoints,
              status,
            },
          });
          resultsProcessed.push(result);
        }
      }

      // 3. Compute Semester GPAs and CGPAs for all students who took exams
      const studentIds = Array.from(new Set(resultsProcessed.map((r) => r.studentId)));
      for (const studentId of studentIds) {
        const studentResults = await prisma.result.findMany({
          where: { studentId, examId },
          include: { subject: true },
        });

        let totalCredits = 0;
        let earnedCredits = 0;
        let weightedPoints = 0;

        for (const r of studentResults) {
          const credits = r.subject.credits;
          totalCredits += credits;
          weightedPoints += r.gradePoints * credits;
          if (r.status === 'PASS') {
            earnedCredits += credits;
          }
        }

        const gpa = totalCredits > 0 ? parseFloat((weightedPoints / totalCredits).toFixed(2)) : 0;
        
        // Simulating cumulative CGPA (in real applications, aggregates history of all terms)
        const cgpa = gpa; 

        await prisma.resultSummary.upsert({
          where: {
            studentId_semesterId: {
              studentId,
              semesterId: exam.semesterId,
            },
          },
          update: {
            gpa,
            cgpa,
            totalCredits,
            earnedCredits,
          },
          create: {
            studentId,
            semesterId: exam.semesterId,
            gpa,
            cgpa,
            totalCredits,
            earnedCredits,
          },
        });
      }

      // Update exam status to process done
      await prisma.exam.update({
        where: { id: examId },
        data: { status: 'RESULT_PROCESSED' },
      });

      res.status(200).json({
        success: true,
        message: `Successfully processed results and semester summaries for ${studentIds.length} students`,
        data: resultsProcessed,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Submit revaluation request
   */
  public static async requestRevaluation(req: Request, res: Response, next: NextFunction) {
    try {
      const { resultId, reason } = req.body;

      const result = await prisma.result.findUnique({
        where: { id: resultId },
      });

      if (!result) {
        throw new NotFoundError('Result record not found');
      }

      const reval = await prisma.revaluation.create({
        data: {
          resultId,
          reason,
          status: RevaluationStatus.PENDING,
          feePaid: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Revaluation request submitted successfully',
        data: reval,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Review/Complete revaluation workflow
   */
  public static async processRevaluation(req: Request, res: Response, next: NextFunction) {
    try {
      const { revaluationId, newMarks, status } = req.body; // status: APPROVED, REJECTED
      const evaluatedBy = req.user?.userId;

      const reval = await prisma.revaluation.findUnique({
        where: { id: revaluationId },
        include: { result: { include: { subject: true } } },
      });

      if (!reval) {
        throw new NotFoundError('Revaluation request not found');
      }

      if (status === 'APPROVED' && newMarks !== undefined) {
        const parsedMarks = parseFloat(newMarks);

        // Update main Result marks
        const newTotal = reval.result.internalMarks + parsedMarks;
        const maxMarks = 50 + 50; // internal (50) + final exam max (50)
        const percentage = (newTotal / maxMarks) * 100;
        const { grade, gradePoints } = ResultController.calculateGrade(percentage);
        const passStatus = grade === 'F' ? 'FAIL' : 'PASS';

        await prisma.result.update({
          where: { id: reval.resultId },
          data: {
            externalMarks: parsedMarks,
            totalMarks: newTotal,
            grade,
            gradePoints,
            status: passStatus,
          },
        });

        await prisma.revaluation.update({
          where: { id: revaluationId },
          data: {
            status: RevaluationStatus.COMPLETED,
            newMarks: parsedMarks,
            evaluatedBy,
          },
        });
      } else {
        await prisma.revaluation.update({
          where: { id: revaluationId },
          data: {
            status: RevaluationStatus.REJECTED,
            evaluatedBy,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: 'Revaluation request processed successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fetch full student reports and summaries
   */
  public static async getTranscript(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;

      const results = await prisma.result.findMany({
        where: { studentId },
        include: {
          subject: true,
          exam: true,
        },
      });

      const summaries = await prisma.resultSummary.findMany({
        where: { studentId },
        include: { semester: true },
      });

      res.status(200).json({
        success: true,
        data: {
          results,
          summaries,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
