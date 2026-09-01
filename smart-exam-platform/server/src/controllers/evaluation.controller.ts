import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
import { AnswerScriptStatus } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export class EvaluationController {
  /**
   * Upload student answer script (PDF file URL simulated) and assign unique barcode
   */
  public static async uploadAnswerScript(req: Request, res: Response, next: NextFunction) {
    try {
      const { examScheduleId, studentId, fileUrl } = req.body;

      // 1. Generate unique 12-digit barcode number
      const barcodeNumber = 'BARCODE-' + Math.floor(100000000000 + Math.random() * 900000000000).toString();

      // 2. Create answer script record
      const script = await prisma.answerScript.create({
        data: {
          examScheduleId,
          studentId,
          barcodeNumber,
          fileUrl,
          status: AnswerScriptStatus.UPLOADED,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Answer script uploaded and barcoded successfully',
        data: script,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Verify / retrieve answer script using barcode scanner simulation
   */
  public static async scanBarcode(req: Request, res: Response, next: NextFunction) {
    try {
      const { barcodeNumber } = req.params;

      const script = await prisma.answerScript.findUnique({
        where: { barcodeNumber },
        include: {
          student: {
            include: {
              user: {
                select: { firstName: true, lastName: true },
              },
            },
          },
          examSchedule: {
            include: {
              subject: true,
              exam: true,
            },
          },
        },
      });

      if (!script) {
        throw new NotFoundError('No answer script matching this barcode could be found');
      }

      res.status(200).json({
        success: true,
        message: 'Barcode scanned and script matched successfully',
        data: script,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Submit grading marks and feedback for an answer script
   */
  public static async submitEvaluation(req: Request, res: Response, next: NextFunction) {
    try {
      const { answerScriptId, questionMarks } = req.body; // questionMarks: Array<{ questionNumber: number, marksObtained: number, remarks?: string }>
      const examinerId = req.user?.userId;

      if (!examinerId) {
        throw new BadRequestError('Examiner authentication token is required');
      }

      const script = await prisma.answerScript.findUnique({
        where: { id: answerScriptId },
      });

      if (!script) {
        throw new NotFoundError('Answer script not found');
      }

      // Calculate total marks obtained
      const totalMarks = questionMarks.reduce((acc: number, cur: any) => acc + parseFloat(cur.marksObtained), 0);

      // Create Evaluation record
      const evaluation = await prisma.evaluation.create({
        data: {
          answerScriptId,
          examinerId,
          marksObtained: totalMarks,
          isCompleted: true,
          details: {
            create: questionMarks.map((q: any) => ({
              questionNumber: q.questionNumber,
              marksObtained: parseFloat(q.marksObtained),
              remarks: q.remarks,
            })),
          },
        },
        include: {
          details: true,
        },
      });

      // Update script status
      await prisma.answerScript.update({
        where: { id: answerScriptId },
        data: { status: AnswerScriptStatus.EVALUATED },
      });

      res.status(200).json({
        success: true,
        message: 'Digital evaluation marks submitted successfully',
        data: evaluation,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fetch all answer scripts
   */
  public static async listScripts(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const scripts = await prisma.answerScript.findMany({
        where: status ? { status: status as AnswerScriptStatus } : {},
        include: {
          student: {
            include: {
              user: {
                select: { firstName: true, lastName: true },
              },
            },
          },
          examSchedule: {
            include: {
              subject: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        data: scripts,
      });
    } catch (err) {
      next(err);
    }
  }
}
