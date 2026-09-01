import { PrismaClient, Role, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // 1. Hash passwords
  const commonPasswordHash = await bcrypt.hash('Password@123', 10);

  // 2. Create College
  const college = await prisma.college.upsert({
    where: { code: 'WIT' },
    update: {},
    create: {
      name: 'Westside Institute of Technology',
      code: 'WIT',
      address: '101 Innovation Boulevard, Tech City',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=200&auto=format&fit=crop',
    },
  });
  console.log('College seeded:', college.name);

  // 3. Create Department
  const department = await prisma.department.upsert({
    where: { code: 'CSE' },
    update: {},
    create: {
      name: 'Computer Science and Engineering',
      code: 'CSE',
      collegeId: college.id,
    },
  });
  console.log('Department seeded:', department.name);

  // 4. Create Academic Year
  const academicYear = await prisma.academicYear.upsert({
    where: { name: '2026-2027' },
    update: {},
    create: {
      name: '2026-2027',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2027-05-31'),
      isActive: true,
    },
  });
  console.log('Academic Year seeded:', academicYear.name);

  // 5. Create Course
  const course = await prisma.course.upsert({
    where: { code: 'BTECH-CSE' },
    update: {},
    create: {
      name: 'Bachelor of Technology in Computer Science',
      code: 'BTECH-CSE',
      departmentId: department.id,
      durationYears: 4,
    },
  });
  console.log('Course seeded:', course.name);

  // 6. Create Semester
  const semester = await prisma.semester.upsert({
    where: {
      courseId_number: {
        courseId: course.id,
        number: 1,
      },
    },
    update: {},
    create: {
      number: 1,
      courseId: course.id,
      academicYearId: academicYear.id,
      isActive: true,
    },
  });
  console.log('Semester 1 seeded');

  // 7. Create Subject
  const subject = await prisma.subject.upsert({
    where: { code: 'CSE-101' },
    update: {},
    create: {
      name: 'Introduction to Programming & Data Structures',
      code: 'CSE-101',
      credits: 4,
      courseId: course.id,
      semesterId: semester.id,
    },
  });
  console.log('Subject seeded:', subject.name);

  // 8. Create Users for all 8 Roles
  const usersToSeed = [
    {
      email: 'superadmin@smartexams.edu',
      firstName: 'Albus',
      lastName: 'Dumbledore',
      role: Role.SUPER_ADMIN,
    },
    {
      email: 'collegeadmin@smartexams.edu',
      firstName: 'Minerva',
      lastName: 'McGonagall',
      role: Role.COLLEGE_ADMIN,
    },
    {
      email: 'hod@smartexams.edu',
      firstName: 'Severus',
      lastName: 'Snape',
      role: Role.DEPARTMENT_HOD,
    },
    {
      email: 'faculty@smartexams.edu',
      firstName: 'Remus',
      lastName: 'Lupin',
      role: Role.FACULTY,
    },
    {
      email: 'internal@smartexams.edu',
      firstName: 'Filius',
      lastName: 'Flitwick',
      role: Role.INTERNAL_EXAMINER,
    },
    {
      email: 'external@smartexams.edu',
      firstName: 'Garrick',
      lastName: 'Ollivander',
      role: Role.EXTERNAL_EXAMINER,
    },
    {
      email: 'student@smartexams.edu',
      firstName: 'Harry',
      lastName: 'Potter',
      role: Role.STUDENT,
    },
    {
      email: 'parent@smartexams.edu',
      firstName: 'James',
      lastName: 'Potter',
      role: Role.PARENT,
    },
  ];

  const seededUsers: Record<string, any> = {};

  for (const item of usersToSeed) {
    const user = await prisma.user.upsert({
      where: { email: item.email },
      update: {},
      create: {
        email: item.email,
        passwordHash: commonPasswordHash,
        firstName: item.firstName,
        lastName: item.lastName,
        role: item.role,
        isEmailVerified: true,
        status: UserStatus.ACTIVE,
      },
    });
    seededUsers[item.role] = user;
    console.log(`User seeded: ${item.email} (${item.role})`);
  }

  // Update Department HOD
  await prisma.department.update({
    where: { id: department.id },
    data: { hodId: seededUsers[Role.DEPARTMENT_HOD].id },
  });

  // 9. Faculty Profiles
  const facultyProfile = await prisma.faculty.upsert({
    where: { userId: seededUsers[Role.FACULTY].id },
    update: {},
    create: {
      userId: seededUsers[Role.FACULTY].id,
      departmentId: department.id,
      designation: 'Assistant Professor',
      bio: 'Instructor for basic programming and computing subjects.',
      subjects: {
        connect: { id: subject.id },
      },
    },
  });
  console.log('Faculty profile created for', seededUsers[Role.FACULTY].email);

  // 10. Parent Profile
  const parentProfile = await prisma.parent.upsert({
    where: { userId: seededUsers[Role.PARENT].id },
    update: {},
    create: {
      userId: seededUsers[Role.PARENT].id,
    },
  });
  console.log('Parent profile created for', seededUsers[Role.PARENT].email);

  // 11. Student Profile
  const studentProfile = await prisma.student.upsert({
    where: { userId: seededUsers[Role.STUDENT].id },
    update: {},
    create: {
      userId: seededUsers[Role.STUDENT].id,
      rollNumber: 'WIT-CSE-2026-001',
      registrationNumber: 'REG-987654321',
      admissionYear: 2026,
      courseId: course.id,
      currentSemesterId: semester.id,
      parentId: parentProfile.id,
    },
  });
  console.log('Student profile created for', seededUsers[Role.STUDENT].email);

  // 12. Create System Settings
  const settings = [
    { key: 'PLATFORM_NAME', value: 'Smart Examination Management Platform' },
    { key: 'ALLOW_STUDENT_REGISTRATION', value: 'true' },
    { key: 'GRADE_CALCULATION_METHOD', value: 'RELATIVE' },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('System settings seeded.');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
