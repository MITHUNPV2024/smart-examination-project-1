import { Router } from 'express';
import { EvaluationController } from '../controllers/evaluation.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Retrieve script metadata by barcode scanner
router.get('/scan/:barcodeNumber', authenticate, EvaluationController.scanBarcode);

// Faculty & Examiner grading tools
router.get('/scripts', authenticate, authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.DEPARTMENT_HOD, Role.INTERNAL_EXAMINER, Role.EXTERNAL_EXAMINER), EvaluationController.listScripts);
router.post('/upload', authenticate, authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.DEPARTMENT_HOD), EvaluationController.uploadAnswerScript);
router.post('/submit', authenticate, authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.DEPARTMENT_HOD, Role.INTERNAL_EXAMINER, Role.EXTERNAL_EXAMINER), EvaluationController.submitEvaluation);

export default router;
