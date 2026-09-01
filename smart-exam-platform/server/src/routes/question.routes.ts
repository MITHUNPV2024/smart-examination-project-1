import { Router } from 'express';
import { QuestionController } from '../controllers/question.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Question Bank Operations
router.get('/', authenticate, QuestionController.listQuestions);
router.post('/', authenticate, authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.DEPARTMENT_HOD), QuestionController.createQuestion);

// AI Generator Operations
router.post('/generate', authenticate, authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.DEPARTMENT_HOD), QuestionController.generateQuestionPaper);

export default router;
