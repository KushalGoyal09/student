/*
  Warnings:

  - A unique constraint covering the columns `[studentId,date,targetType]` on the table `Target` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `targetType` to the `Target` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('Regular', 'Revision', 'Extra');

-- DropIndex
DROP INDEX "Target_studentId_date_key";

-- AlterTable
ALTER TABLE "Target" ADD COLUMN     "targetType" "TargetType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Target_studentId_date_targetType_key" ON "Target"("studentId", "date", "targetType");
