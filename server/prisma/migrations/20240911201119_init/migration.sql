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
    "groupMentorId" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "Student_whattsapNumber_key" ON "Student"("whattsapNumber");

-- AddForeignKey
ALTER TABLE "SeniorMentor" ADD CONSTRAINT "SeniorMentor_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMentor" ADD CONSTRAINT "GroupMentor_seniorMentorId_fkey" FOREIGN KEY ("seniorMentorId") REFERENCES "SeniorMentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_groupMentorId_fkey" FOREIGN KEY ("groupMentorId") REFERENCES "GroupMentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingBySupervisor" ADD CONSTRAINT "RatingBySupervisor_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingBySupervisor" ADD CONSTRAINT "RatingBySupervisor_groupMentorId_fkey" FOREIGN KEY ("groupMentorId") REFERENCES "GroupMentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingByStudent" ADD CONSTRAINT "RatingByStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("whattsapNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingByStudent" ADD CONSTRAINT "RatingByStudent_groupMentorId_fkey" FOREIGN KEY ("groupMentorId") REFERENCES "GroupMentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
