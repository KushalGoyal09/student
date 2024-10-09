-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Supervisor', 'SeniorMentor', 'GroupMentor');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "explaination" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "craetedByUserId" TEXT NOT NULL,
    "createdByRole" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);
