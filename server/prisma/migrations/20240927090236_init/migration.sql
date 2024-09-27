-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('Scheduled', 'Done', 'DNP');

-- CreateEnum
CREATE TYPE "DaysOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateTable
CREATE TABLE "Supervisor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeniorMentor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "supervisorId" TEXT,

    CONSTRAINT "SeniorMentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMentor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
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
    "groupMentorId" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
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
    "studentId" TEXT NOT NULL,

    CONSTRAINT "Fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mode" TEXT,
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
    "mentorId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "physics" INTEGER NOT NULL,
    "chemistry" INTEGER NOT NULL,
    "biology" INTEGER NOT NULL,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Week_startDate_mentorId_key" ON "Week"("startDate", "mentorId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentCallRecord_studentId_weekId_key" ON "StudentCallRecord"("studentId", "weekId");

-- CreateIndex
CREATE UNIQUE INDEX "Call_date_studentRecordId_key" ON "Call"("date", "studentRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "Fees_studentId_key" ON "Fees"("studentId");

-- AddForeignKey
ALTER TABLE "SeniorMentor" ADD CONSTRAINT "SeniorMentor_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMentor" ADD CONSTRAINT "GroupMentor_seniorMentorId_fkey" FOREIGN KEY ("seniorMentorId") REFERENCES "SeniorMentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_groupMentorId_fkey" FOREIGN KEY ("groupMentorId") REFERENCES "GroupMentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "RatingByStudent" ADD CONSTRAINT "RatingByStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("whattsapNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingByStudent" ADD CONSTRAINT "RatingByStudent_groupMentorId_fkey" FOREIGN KEY ("groupMentorId") REFERENCES "GroupMentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_physics_fkey" FOREIGN KEY ("physics") REFERENCES "PhysicsSyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_chemistry_fkey" FOREIGN KEY ("chemistry") REFERENCES "ChemistrySyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_biology_fkey" FOREIGN KEY ("biology") REFERENCES "BiologySyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "GroupMentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
