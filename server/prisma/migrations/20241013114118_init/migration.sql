-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('Scheduled', 'Done', 'DNP');

-- CreateEnum
CREATE TYPE "DaysOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateEnum
CREATE TYPE "MentorshipPlan" AS ENUM ('Elite', 'Pro', 'Max');

-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('Regular', 'Revision', 'Extra');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Supervisor', 'SeniorMentor', 'GroupMentor');

-- CreateEnum
CREATE TYPE "Month" AS ENUM ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

-- CreateTable
CREATE TABLE "Supervisor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "FeeManagement" BOOLEAN NOT NULL DEFAULT false,
    "KitDispatch" BOOLEAN NOT NULL DEFAULT false,
    "AssaignMentor" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeniorMentor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "supervisorId" TEXT,

    CONSTRAINT "SeniorMentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMentor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "whattsapLink" TEXT,
    "seniorMentorId" TEXT,

    CONSTRAINT "GroupMentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "whattsapNumber" TEXT NOT NULL,
    "callNumber" TEXT NOT NULL,
    "motherNumber" TEXT NOT NULL,
    "fatherNumber" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "StudyHours" INTEGER NOT NULL,
    "class" TEXT NOT NULL,
    "dropperStatus" TEXT NOT NULL,
    "previousScore" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "expectation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "dateOfDeactive" TIMESTAMP(3),
    "kitDispatched" BOOLEAN NOT NULL DEFAULT false,
    "kitDispatchedDate" TIMESTAMP(3),
    "whattsapGroupLink" TEXT,
    "groupMentorId" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicsVisionBoard" (
    "id" TEXT NOT NULL,
    "notes" BOOLEAN NOT NULL,
    "leacture" BOOLEAN NOT NULL,
    "ncert" BOOLEAN NOT NULL,
    "QP" BOOLEAN NOT NULL,
    "revision" BOOLEAN NOT NULL,
    "viva" BOOLEAN NOT NULL,
    "studentId" TEXT NOT NULL,
    "physicsSyallabusId" INTEGER NOT NULL,

    CONSTRAINT "PhysicsVisionBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChemistryVisionBoard" (
    "id" TEXT NOT NULL,
    "notes" BOOLEAN NOT NULL,
    "leacture" BOOLEAN NOT NULL,
    "ncert" BOOLEAN NOT NULL,
    "QP" BOOLEAN NOT NULL,
    "revision" BOOLEAN NOT NULL,
    "viva" BOOLEAN NOT NULL,
    "studentId" TEXT NOT NULL,
    "chemistrySyallabusId" INTEGER NOT NULL,

    CONSTRAINT "ChemistryVisionBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiologyVisionBoard" (
    "id" TEXT NOT NULL,
    "notes" BOOLEAN NOT NULL,
    "leacture" BOOLEAN NOT NULL,
    "ncert" BOOLEAN NOT NULL,
    "QP" BOOLEAN NOT NULL,
    "revision" BOOLEAN NOT NULL,
    "viva" BOOLEAN NOT NULL,
    "studentId" TEXT NOT NULL,
    "biologySyallabusId" INTEGER NOT NULL,

    CONSTRAINT "BiologyVisionBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Week" (
    "id" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,

    CONSTRAINT "Week_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentCallRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,

    CONSTRAINT "StudentCallRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "day" "DaysOfWeek" NOT NULL,
    "callStatus" "CallStatus" NOT NULL,
    "studentRecordId" TEXT NOT NULL,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fees" (
    "id" TEXT NOT NULL,
    "feesPlan" INTEGER NOT NULL DEFAULT 1,
    "allClear" BOOLEAN NOT NULL DEFAULT false,
    "mentorshipPlan" "MentorshipPlan" NOT NULL DEFAULT 'Elite',
    "studentId" TEXT NOT NULL,

    CONSTRAINT "Fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "mode" TEXT,
    "cleared" BOOLEAN NOT NULL DEFAULT false,
    "feesId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RatingBySupervisor" (
    "id" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "meeting" INTEGER NOT NULL,
    "calling" INTEGER NOT NULL,
    "responsibility" INTEGER NOT NULL,
    "availability" INTEGER NOT NULL,
    "targetAssaigning" INTEGER NOT NULL,
    "targetChecking" INTEGER NOT NULL,
    "supervisorId" TEXT NOT NULL,
    "groupMentorId" TEXT NOT NULL,

    CONSTRAINT "RatingBySupervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RatingByStudent" (
    "id" TEXT NOT NULL,
    "bonding" INTEGER NOT NULL,
    "targetAssaigningAndChecking" INTEGER NOT NULL,
    "calling" INTEGER NOT NULL,
    "seriousness" INTEGER NOT NULL,
    "exceptation" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "groupMentorId" TEXT NOT NULL,

    CONSTRAINT "RatingByStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "username" TEXT NOT NULL DEFAULT 'admin',
    "password" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "PhysicsSyallabus" (
    "id" SERIAL NOT NULL,
    "chapterName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhysicsSyallabus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChemistrySyallabus" (
    "id" SERIAL NOT NULL,
    "chapterName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChemistrySyallabus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiologySyallabus" (
    "id" SERIAL NOT NULL,
    "chapterName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BiologySyallabus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Target" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "date" TEXT NOT NULL,
    "targetType" "TargetType" NOT NULL,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicsTarget" (
    "id" TEXT NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "targetId" TEXT,

    CONSTRAINT "PhysicsTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChemistryTarget" (
    "id" TEXT NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "targetId" TEXT,

    CONSTRAINT "ChemistryTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiologyTarget" (
    "id" TEXT NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "targetId" TEXT,

    CONSTRAINT "BiologyTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "explaination" TEXT,
    "audioFile" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "craetedByUserId" TEXT NOT NULL,
    "createdByRole" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorSalary" (
    "id" TEXT NOT NULL,
    "Role" "Role" NOT NULL,
    "userId" TEXT NOT NULL,
    "month" "Month" NOT NULL,
    "year" INTEGER NOT NULL,
    "basePay" INTEGER NOT NULL,
    "perStudentPay" INTEGER NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MentorSalary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supervisor_username_key" ON "Supervisor"("username");

-- CreateIndex
CREATE UNIQUE INDEX "SeniorMentor_username_key" ON "SeniorMentor"("username");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMentor_username_key" ON "GroupMentor"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Student_whattsapNumber_key" ON "Student"("whattsapNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicsVisionBoard_studentId_physicsSyallabusId_key" ON "PhysicsVisionBoard"("studentId", "physicsSyallabusId");

-- CreateIndex
CREATE UNIQUE INDEX "ChemistryVisionBoard_studentId_chemistrySyallabusId_key" ON "ChemistryVisionBoard"("studentId", "chemistrySyallabusId");

-- CreateIndex
CREATE UNIQUE INDEX "BiologyVisionBoard_studentId_biologySyallabusId_key" ON "BiologyVisionBoard"("studentId", "biologySyallabusId");

-- CreateIndex
CREATE UNIQUE INDEX "Week_startDate_mentorId_key" ON "Week"("startDate", "mentorId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentCallRecord_studentId_weekId_key" ON "StudentCallRecord"("studentId", "weekId");

-- CreateIndex
CREATE UNIQUE INDEX "Call_date_studentRecordId_key" ON "Call"("date", "studentRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "Fees_studentId_key" ON "Fees"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "RatingBySupervisor_supervisorId_groupMentorId_key" ON "RatingBySupervisor"("supervisorId", "groupMentorId");

-- CreateIndex
CREATE UNIQUE INDEX "RatingByStudent_studentId_groupMentorId_key" ON "RatingByStudent"("studentId", "groupMentorId");

-- CreateIndex
CREATE UNIQUE INDEX "Target_studentId_date_targetType_key" ON "Target"("studentId", "date", "targetType");

-- AddForeignKey
ALTER TABLE "SeniorMentor" ADD CONSTRAINT "SeniorMentor_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMentor" ADD CONSTRAINT "GroupMentor_seniorMentorId_fkey" FOREIGN KEY ("seniorMentorId") REFERENCES "SeniorMentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_groupMentorId_fkey" FOREIGN KEY ("groupMentorId") REFERENCES "GroupMentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicsVisionBoard" ADD CONSTRAINT "PhysicsVisionBoard_physicsSyallabusId_fkey" FOREIGN KEY ("physicsSyallabusId") REFERENCES "PhysicsSyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicsVisionBoard" ADD CONSTRAINT "PhysicsVisionBoard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemistryVisionBoard" ADD CONSTRAINT "ChemistryVisionBoard_chemistrySyallabusId_fkey" FOREIGN KEY ("chemistrySyallabusId") REFERENCES "ChemistrySyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemistryVisionBoard" ADD CONSTRAINT "ChemistryVisionBoard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologyVisionBoard" ADD CONSTRAINT "BiologyVisionBoard_biologySyallabusId_fkey" FOREIGN KEY ("biologySyallabusId") REFERENCES "BiologySyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologyVisionBoard" ADD CONSTRAINT "BiologyVisionBoard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Week" ADD CONSTRAINT "Week_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "GroupMentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCallRecord" ADD CONSTRAINT "StudentCallRecord_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCallRecord" ADD CONSTRAINT "StudentCallRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_studentRecordId_fkey" FOREIGN KEY ("studentRecordId") REFERENCES "StudentCallRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fees" ADD CONSTRAINT "Fees_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_feesId_fkey" FOREIGN KEY ("feesId") REFERENCES "Fees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingBySupervisor" ADD CONSTRAINT "RatingBySupervisor_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingBySupervisor" ADD CONSTRAINT "RatingBySupervisor_groupMentorId_fkey" FOREIGN KEY ("groupMentorId") REFERENCES "GroupMentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingByStudent" ADD CONSTRAINT "RatingByStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingByStudent" ADD CONSTRAINT "RatingByStudent_groupMentorId_fkey" FOREIGN KEY ("groupMentorId") REFERENCES "GroupMentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicsTarget" ADD CONSTRAINT "PhysicsTarget_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "PhysicsSyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicsTarget" ADD CONSTRAINT "PhysicsTarget_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemistryTarget" ADD CONSTRAINT "ChemistryTarget_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "ChemistrySyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemistryTarget" ADD CONSTRAINT "ChemistryTarget_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologyTarget" ADD CONSTRAINT "BiologyTarget_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "BiologySyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologyTarget" ADD CONSTRAINT "BiologyTarget_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE SET NULL ON UPDATE CASCADE;
