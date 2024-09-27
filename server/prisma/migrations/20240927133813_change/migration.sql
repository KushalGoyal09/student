/*
  Warnings:

  - Added the required column `fromDate` to the `BiologyTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lecturePerDay` to the `BiologyTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toDate` to the `BiologyTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromDate` to the `ChemistryTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lecturePerDay` to the `ChemistryTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toDate` to the `ChemistryTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromDate` to the `PhysicsTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lecturePerDay` to the `PhysicsTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toDate` to the `PhysicsTarget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BiologyTarget" ADD COLUMN     "fromDate" TEXT NOT NULL,
ADD COLUMN     "lecturePerDay" INTEGER NOT NULL,
ADD COLUMN     "toDate" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChemistryTarget" ADD COLUMN     "fromDate" TEXT NOT NULL,
ADD COLUMN     "lecturePerDay" INTEGER NOT NULL,
ADD COLUMN     "toDate" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PhysicsTarget" ADD COLUMN     "fromDate" TEXT NOT NULL,
ADD COLUMN     "lecturePerDay" INTEGER NOT NULL,
ADD COLUMN     "toDate" TEXT NOT NULL;
