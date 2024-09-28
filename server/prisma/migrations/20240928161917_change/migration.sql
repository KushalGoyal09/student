/*
  Warnings:

  - You are about to drop the column `rating` on the `GroupMentor` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `SeniorMentor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,groupMentorId]` on the table `RatingByStudent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[supervisorId,groupMentorId]` on the table `RatingBySupervisor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GroupMentor" DROP COLUMN "rating";

-- AlterTable
ALTER TABLE "SeniorMentor" DROP COLUMN "rating";

-- CreateIndex
CREATE UNIQUE INDEX "RatingByStudent_studentId_groupMentorId_key" ON "RatingByStudent"("studentId", "groupMentorId");

-- CreateIndex
CREATE UNIQUE INDEX "RatingBySupervisor_supervisorId_groupMentorId_key" ON "RatingBySupervisor"("supervisorId", "groupMentorId");
