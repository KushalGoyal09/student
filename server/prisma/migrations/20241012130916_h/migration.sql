/*
  Warnings:

  - You are about to drop the column `physicsSyallabusId` on the `BiologyVisionBoard` table. All the data in the column will be lost.
  - You are about to drop the column `physicsSyallabusId` on the `ChemistryVisionBoard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,biologySyallabusId]` on the table `BiologyVisionBoard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,chemistrySyallabusId]` on the table `ChemistryVisionBoard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `biologySyallabusId` to the `BiologyVisionBoard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chemistrySyallabusId` to the `ChemistryVisionBoard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BiologyVisionBoard" DROP CONSTRAINT "BiologyVisionBoard_physicsSyallabusId_fkey";

-- DropForeignKey
ALTER TABLE "ChemistryVisionBoard" DROP CONSTRAINT "ChemistryVisionBoard_physicsSyallabusId_fkey";

-- DropIndex
DROP INDEX "BiologyVisionBoard_studentId_physicsSyallabusId_key";

-- DropIndex
DROP INDEX "ChemistryVisionBoard_studentId_physicsSyallabusId_key";

-- AlterTable
ALTER TABLE "BiologyVisionBoard" DROP COLUMN "physicsSyallabusId",
ADD COLUMN     "biologySyallabusId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ChemistryVisionBoard" DROP COLUMN "physicsSyallabusId",
ADD COLUMN     "chemistrySyallabusId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BiologyVisionBoard_studentId_biologySyallabusId_key" ON "BiologyVisionBoard"("studentId", "biologySyallabusId");

-- CreateIndex
CREATE UNIQUE INDEX "ChemistryVisionBoard_studentId_chemistrySyallabusId_key" ON "ChemistryVisionBoard"("studentId", "chemistrySyallabusId");

-- AddForeignKey
ALTER TABLE "ChemistryVisionBoard" ADD CONSTRAINT "ChemistryVisionBoard_chemistrySyallabusId_fkey" FOREIGN KEY ("chemistrySyallabusId") REFERENCES "ChemistrySyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologyVisionBoard" ADD CONSTRAINT "BiologyVisionBoard_biologySyallabusId_fkey" FOREIGN KEY ("biologySyallabusId") REFERENCES "BiologySyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
