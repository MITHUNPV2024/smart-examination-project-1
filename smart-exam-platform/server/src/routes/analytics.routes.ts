import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Student-specific analytics
router.get('/weaknesses/:studentId', authenticate, AnalyticsController.getStudentWeaknesses);
router.get('/predict/:studentId', authenticate, AnalyticsController.predictFinalMarks);

// Departmental aggregates
router.get('/department', authenticate, authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.DEPARTMENT_HOD), AnalyticsController.getDepartmentMetrics);

export default router;
