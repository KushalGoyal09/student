/*
  Warnings:

  - You are about to drop the column `vivas` on the `BiologyVisionBoard` table. All the data in the column will be lost.
  - You are about to drop the column `vivas` on the `ChemistryVisionBoard` table. All the data in the column will be lost.
  - You are about to drop the column `vivas` on the `PhysicsVisionBoard` table. All the data in the column will be lost.
  - Added the required column `viva` to the `BiologyVisionBoard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viva` to the `ChemistryVisionBoard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viva` to the `PhysicsVisionBoard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BiologyVisionBoard" DROP COLUMN "vivas",
ADD COLUMN     "viva" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "ChemistryVisionBoard" DROP COLUMN "vivas",
ADD COLUMN     "viva" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "PhysicsVisionBoard" DROP COLUMN "vivas",
ADD COLUMN     "viva" BOOLEAN NOT NULL;
