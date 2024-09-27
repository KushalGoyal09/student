/*
  Warnings:

  - You are about to drop the column `physicsChapterId` on the `BiologyTarget` table. All the data in the column will be lost.
  - Added the required column `chapterId` to the `BiologyTarget` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BiologyTarget" DROP CONSTRAINT "BiologyTarget_physicsChapterId_fkey";

-- AlterTable
ALTER TABLE "BiologyTarget" DROP COLUMN "physicsChapterId",
ADD COLUMN     "chapterId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "BiologyTarget" ADD CONSTRAINT "BiologyTarget_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "BiologySyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
