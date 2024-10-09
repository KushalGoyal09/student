-- CreateEnum
CREATE TYPE "MentorshipPlan" AS ENUM ('Elite', 'Pro', 'Max');

-- AlterTable
ALTER TABLE "Fees" ADD COLUMN     "mentorshipPlan" "MentorshipPlan" NOT NULL DEFAULT 'Elite';
