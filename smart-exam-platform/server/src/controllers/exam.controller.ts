import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
import { BadRequestError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

export class ExamController {
  /**
   * Create a new Exam term (e.g. End Semester Exams)
   */
  public static async createExam(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, type, academicYearId, semesterId, startDate, endDate } = req.body;
      
      const exam = await prisma.exam.create({
        data: {
          name,
          type,
          academicYearId,
          semesterId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status: 'SCHEDULED',
        },
      });

      res.status(201).json({
        success: true,
        message: 'Exam session created successfully',
        data: exam,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Schedule a specific subject exam timetable
   */
  public static async createSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { examId, subjectId, date, startTime, endTime, maxMarks, passMarks } = req.body;

      const schedule = await prisma.examSchedule.create({
        data: {
          examId,
          subjectId,
          date: new Date(date),
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          maxMarks: parseInt(maxMarks),
          passMarks: parseInt(passMarks),
        },
      });

      res.status(201).json({
        success: true,
        message: 'Subject exam scheduled successfully',
        data: schedule,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Allocate rooms for a scheduled exam automatically
   */
  public static async allocateRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const { examScheduleId, roomIds } = req.body; // array of room IDs to distribute students across

      // 1. Get the exam schedule and subject to find enrolled students
      const schedule = await prisma.examSchedule.findUnique({
        where: { id: examScheduleId },
        include: { subject: true },
      });

      if (!schedule) {
        throw new NotFoundError('Exam schedule not found');
      }

      // 2. Fetch all students registered in this course/semester
      const students = await prisma.student.findMany({
        where: {
          courseId: schedule.subject.courseId,
          currentSemesterId: schedule.subject.semesterId,
        },
        orderBy: { rollNumber: 'asc' },
      });

      if (students.length === 0) {
        throw new BadRequestError('No students enrolled in this course/semester to allocate');
      }

      // 3. Fetch rooms
      const rooms = await prisma.room.findMany({
        where: { id: { in: roomIds } },
      });

      if (rooms.length === 0) {
        throw new BadRequestError('No valid rooms provided for allocation');
      }

      // 4. Distribute students across classrooms based on seat capacity
      let studentIndex = 0;
      const allocations = [];

      // Clear existing allocations for this schedule
      await prisma.roomAllocation.deleteMany({
        where: { examScheduleId },
      });

      for (const room of rooms) {
        const capacity = room.capacity;
        for (let seat = 1; seat <= capacity; seat++) {
          if (studentIndex >= students.length) break;

          const student = students[studentIndex];
          const allocation = await prisma.roomAllocation.create({
            data: {
              examScheduleId,
              roomId: room.id,
              studentId: student.id,
              seatNumber: `SEAT-${room.name}-${seat}`,
            },
          });
          allocations.push(allocation);
          studentIndex++;
        }
        if (studentIndex >= students.length) break;
      }

      if (studentIndex < students.length) {
        logger.warn(`Not enough room capacity. Allocated ${studentIndex} of ${students.length} students.`);
      }

      res.status(200).json({
        success: true,
        message: `Successfully allocated seats for ${studentIndex} students`,
        data: allocations,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fetch room allocations for a scheduled exam
   */
  public static async getRoomAllocations(req: Request, res: Response, next: NextFunction) {
    try {
      const { examScheduleId } = req.params;
      const allocations = await prisma.roomAllocation.findMany({
        where: { examScheduleId },
        include: {
          room: true,
          student: {
            include: {
              user: {
                select: { firstName: true, lastName: true, email: true },
              },
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        data: allocations,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Submit / Mark student attendance for an exam
   */
  public static async markAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { examScheduleId, studentId, status } = req.body;
      const markedByUserId = req.user?.userId;

      const attendance = await prisma.attendance.upsert({
        where: {
          examScheduleId_studentId: { examScheduleId, studentId },
        },
        update: {
          status,
          markedByUserId,
          markedAt: new Date(),
        },
        create: {
          examScheduleId,
          studentId,
          status,
          markedByUserId,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Attendance record submitted successfully',
        data: attendance,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fetch exam timetable schedules
   */
  public static async listSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      const schedules = await prisma.examSchedule.findMany({
        include: {
          exam: true,
          subject: true,
        },
        orderBy: { date: 'asc' },
      });

      res.status(200).json({
        success: true,
        data: schedules,
      });
    } catch (err) {
      next(err);
    }
  }
}
