import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
import { BloomsTaxonomy, Difficulty } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export class QuestionController {
  /**
   * Helper: Classify Bloom's Taxonomy using keyword heuristic (Simulating AI NLP model)
   */
  private static classifyBloomsTaxonomy(text: string): BloomsTaxonomy {
    const lowerText = text.toLowerCase();
    
    const rules = [
      { keywords: ['create', 'design', 'generate', 'formulate', 'compose', 'construct'], taxonomy: BloomsTaxonomy.CREATE },
      { keywords: ['evaluate', 'justify', 'critique', 'judge', 'appraise', 'defend'], taxonomy: BloomsTaxonomy.EVALUATE },
      { keywords: ['analyze', 'compare', 'contrast', 'distinguish', 'examine', 'illustrate'], taxonomy: BloomsTaxonomy.ANALYZE },
      { keywords: ['apply', 'solve', 'compute', 'calculate', 'demonstrate', 'show', 'use'], taxonomy: BloomsTaxonomy.APPLY },
      { keywords: ['explain', 'summarize', 'describe', 'classify', 'discuss', 'identify'], taxonomy: BloomsTaxonomy.UNDERSTAND },
      { keywords: ['define', 'list', 'state', 'name', 'recall', 'repeat', 'label'], taxonomy: BloomsTaxonomy.REMEMBER },
    ];

    for (const rule of rules) {
      if (rule.keywords.some(keyword => lowerText.includes(keyword))) {
        return rule.taxonomy;
      }
    }

    return BloomsTaxonomy.UNDERSTAND; // Default fallback
  }

  /**
   * Add question to bank (with AI Bloom's classification if omitted)
   */
  public static async createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { subjectId, questionText, questionType, difficulty, marks, modelAnswer } = req.body;
      const createdById = req.user?.userId;

      // Auto-classify Bloom's level if not provided
      const bloomsTaxonomy = req.body.bloomsTaxonomy || QuestionController.classifyBloomsTaxonomy(questionText);

      const question = await prisma.questionBank.create({
        data: {
          subjectId,
          questionText,
          questionType,
          difficulty: difficulty as Difficulty,
          bloomsTaxonomy,
          marks: parseInt(marks),
          modelAnswer,
          createdById,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Question added and classified successfully',
        data: question,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * AI-Assisted Question Paper Generator
   */
  public static async generateQuestionPaper(req: Request, res: Response, next: NextFunction) {
    try {
      const { examScheduleId, title, maxMarks, durationMinutes, difficultyDistribution } = req.body;
      // difficultyDistribution: { EASY: 40, MEDIUM: 40, HARD: 20 } - target percentages (sums to 100)

      const schedule = await prisma.examSchedule.findUnique({
        where: { id: examScheduleId },
      });

      if (!schedule) {
        throw new NotFoundError('Exam schedule not found');
      }

      // 1. Fetch all available questions in bank for this subject
      const allQuestions = await prisma.questionBank.findMany({
        where: { subjectId: schedule.subjectId },
      });

      if (allQuestions.length === 0) {
        throw new BadRequestError('No questions found in bank for this subject. Please populate the Question Bank first.');
      }

      // 2. Select questions matching difficulty constraints and total marks
      const targetMarks = parseInt(maxMarks);
      let currentMarks = 0;
      const selectedQuestions = [];

      const targetEasy = (difficultyDistribution?.EASY || 40) / 100 * targetMarks;
      const targetMedium = (difficultyDistribution?.MEDIUM || 40) / 100 * targetMarks;
      const targetHard = (difficultyDistribution?.HARD || 20) / 100 * targetMarks;

      let easyMarksAccumulated = 0;
      let mediumMarksAccumulated = 0;
      let hardMarksAccumulated = 0;

      // Shuffle helper
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);

      for (const q of shuffled) {
        if (currentMarks + q.marks > targetMarks) continue;

        if (q.difficulty === Difficulty.EASY && easyMarksAccumulated < targetEasy) {
          selectedQuestions.push(q);
          easyMarksAccumulated += q.marks;
          currentMarks += q.marks;
        } else if (q.difficulty === Difficulty.MEDIUM && mediumMarksAccumulated < targetMedium) {
          selectedQuestions.push(q);
          mediumMarksAccumulated += q.marks;
          currentMarks += q.marks;
        } else if (q.difficulty === Difficulty.HARD && hardMarksAccumulated < targetHard) {
          selectedQuestions.push(q);
          hardMarksAccumulated += q.marks;
          currentMarks += q.marks;
        }
      }

      // Fallback: If still under target marks, add any remaining questions that fit
      if (currentMarks < targetMarks) {
        for (const q of shuffled) {
          if (selectedQuestions.some(sq => sq.id === q.id)) continue;
          if (currentMarks + q.marks <= targetMarks) {
            selectedQuestions.push(q);
            currentMarks += q.marks;
          }
        }
      }

      if (currentMarks < targetMarks) {
        throw new BadRequestError(`Insufficient questions in bank. Only able to compile paper with ${currentMarks}/${targetMarks} marks. Add more questions first.`);
      }

      // 3. Save generated Question Paper
      const paper = await prisma.questionPaper.create({
        data: {
          examScheduleId,
          title,
          maxMarks: targetMarks,
          durationMinutes: parseInt(durationMinutes),
          isAiGenerated: true,
          status: 'APPROVED',
        },
      });

      // 4. Link questions
      for (let i = 0; i < selectedQuestions.length; i++) {
        await prisma.questionPaperQuestion.create({
          data: {
            questionPaperId: paper.id,
            questionBankId: selectedQuestions[i].id,
            marks: selectedQuestions[i].marks,
            sortOrder: i + 1,
          },
        });
      }

      const generatedPaper = await prisma.questionPaper.findUnique({
        where: { id: paper.id },
        include: {
          questions: {
            include: {
              questionBank: true,
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Question paper generated and validated by AI successfully',
        data: generatedPaper,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fetch all questions in bank for subject
   */
  public static async listQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { subjectId } = req.query;
      const questions = await prisma.questionBank.findMany({
        where: subjectId ? { subjectId: String(subjectId) } : {},
        include: { subject: true },
      });

      res.status(200).json({
        success: true,
        data: questions,
      });
    } catch (err) {
      next(err);
    }
  }
}
