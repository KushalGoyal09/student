-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('Scheduled', 'Done', 'DOP');

-- CreateTable
CREATE TABLE "Week" (
    "id" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "mentorId" TEXT NOT NULL,

    CONSTRAINT "Week_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentCallRecord" (
    "id" TEXT NOT NULL,
    "stuentId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,

    CONSTRAINT "StudentCallRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "CallStatus" NOT NULL DEFAULT 'Scheduled',
    "studentId" TEXT NOT NULL,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Week" ADD CONSTRAINT "Week_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "GroupMentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCallRecord" ADD CONSTRAINT "StudentCallRecord_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentCallRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
