import { Router } from 'express';
import { ResultController } from '../controllers/result.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Process results (Grade & GPA calculations)
router.post('/process', authenticate, authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN), ResultController.processResults);

// Revaluation Requests
router.post('/revalue', authenticate, authorize(Role.STUDENT), ResultController.requestRevaluation);
router.post('/revalue/process', authenticate, authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.DEPARTMENT_HOD, Role.INTERNAL_EXAMINER, Role.EXTERNAL_EXAMINER), ResultController.processRevaluation);

// Transcripts
router.get('/transcript/:studentId', authenticate, ResultController.getTranscript);

export default router;
