/*
  Warnings:

  - You are about to drop the column `numberOfLectur` on the `BiologyTarget` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfLectur` on the `ChemistryTarget` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfLectur` on the `PhysicsTarget` table. All the data in the column will be lost.
  - Added the required column `numberOfLecture` to the `BiologyTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfLecture` to the `ChemistryTarget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfLecture` to the `PhysicsTarget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BiologyTarget" DROP COLUMN "numberOfLectur",
ADD COLUMN     "numberOfLecture" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ChemistryTarget" DROP COLUMN "numberOfLectur",
ADD COLUMN     "numberOfLecture" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PhysicsTarget" DROP COLUMN "numberOfLectur",
ADD COLUMN     "numberOfLecture" INTEGER NOT NULL;
