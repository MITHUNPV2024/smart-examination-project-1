import { Router } from 'express';
import { ExamController } from '../controllers/exam.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Timetables and schedules lists
router.get('/schedules', authenticate, ExamController.listSchedules);

// Admin-only operations
router.post('/', authenticate, authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN), ExamController.createExam);
router.post('/schedule', authenticate, authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN), ExamController.createSchedule);
router.post('/allocate-rooms', authenticate, authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN), ExamController.allocateRooms);

// Allocations
router.get('/allocations/:examScheduleId', authenticate, ExamController.getRoomAllocations);

// Attendance marking
router.post('/attendance', authenticate, authorize(Role.SUPER_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY, Role.DEPARTMENT_HOD), ExamController.markAttendance);

export default router;
