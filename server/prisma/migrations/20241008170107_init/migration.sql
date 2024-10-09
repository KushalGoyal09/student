/*
  Warnings:

  - You are about to drop the column `fromDate` on the `BiologyTarget` table. All the data in the column will be lost.
  - You are about to drop the column `lecturePerDay` on the `BiologyTarget` table. All the data in the column will be lost.
  - You are about to drop the column `toDate` on the `BiologyTarget` table. All the data in the column will be lost.
  - You are about to drop the column `fromDate` on the `ChemistryTarget` table. All the data in the column will be lost.
  - You are about to drop the column `lecturePerDay` on the `ChemistryTarget` table. All the data in the column will be lost.
  - You are about to drop the column `toDate` on the `ChemistryTarget` table. All the data in the column will be lost.
  - You are about to drop the column `fromDate` on the `PhysicsTarget` table. All the data in the column will be lost.
  - You are about to drop the column `lecturePerDay` on the `PhysicsTarget` table. All the data in the column will be lost.
  - You are about to drop the column `toDate` on the `PhysicsTarget` table. All the data in the column will be lost.
  - You are about to drop the column `mentorId` on the `Target` table. All the data in the column will be lost.
  - Added the required column `date` to the `Target` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Target" DROP CONSTRAINT "Target_mentorId_fkey";

-- AlterTable
ALTER TABLE "BiologyTarget" DROP COLUMN "fromDate",
DROP COLUMN "lecturePerDay",
DROP COLUMN "toDate";

-- AlterTable
ALTER TABLE "ChemistryTarget" DROP COLUMN "fromDate",
DROP COLUMN "lecturePerDay",
DROP COLUMN "toDate";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "cleared" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "date" DROP DEFAULT,
ALTER COLUMN "date" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PhysicsTarget" DROP COLUMN "fromDate",
DROP COLUMN "lecturePerDay",
DROP COLUMN "toDate";

-- AlterTable
ALTER TABLE "Target" DROP COLUMN "mentorId",
ADD COLUMN     "date" TEXT NOT NULL;
