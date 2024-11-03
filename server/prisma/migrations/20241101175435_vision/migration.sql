/*
  Warnings:

  - Added the required column `numberOfLectur` to the `BiologyTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfLectur` to the `ChemistryTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfLectur` to the `PhysicsTarget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BiologyTarget" ADD COLUMN     "isFinal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "numberOfLectur" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ChemistryTarget" ADD COLUMN     "isFinal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "numberOfLectur" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PhysicsTarget" ADD COLUMN     "isFinal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "numberOfLectur" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PhysicsVisionBoard" ADD COLUMN     "numberOfExtraLectures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "numberOfRegularLectures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "numberOfRevisionLectures" INTEGER NOT NULL DEFAULT 0;
