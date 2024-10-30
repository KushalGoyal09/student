/*
  Warnings:

  - You are about to drop the column `mentorId` on the `ParentsCallRecordSenior` table. All the data in the column will be lost.
  - You are about to drop the column `mentorId` on the `StudentCallRecordSenior` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ParentsCallRecordSenior" DROP COLUMN "mentorId";

-- AlterTable
ALTER TABLE "StudentCallRecordSenior" DROP COLUMN "mentorId";
