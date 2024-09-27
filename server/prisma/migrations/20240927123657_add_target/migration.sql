/*
  Warnings:

  - You are about to drop the column `biology` on the `Target` table. All the data in the column will be lost.
  - You are about to drop the column `chemistry` on the `Target` table. All the data in the column will be lost.
  - You are about to drop the column `physics` on the `Target` table. All the data in the column will be lost.
  - Added the required column `biologyTargetId` to the `Target` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chemistryTargetId` to the `Target` table without a default value. This is not possible if the table is not empty.
  - Added the required column `physicsTargetId` to the `Target` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Target" DROP CONSTRAINT "Target_biology_fkey";

-- DropForeignKey
ALTER TABLE "Target" DROP CONSTRAINT "Target_chemistry_fkey";

-- DropForeignKey
ALTER TABLE "Target" DROP CONSTRAINT "Target_physics_fkey";

-- AlterTable
ALTER TABLE "Target" DROP COLUMN "biology",
DROP COLUMN "chemistry",
DROP COLUMN "physics",
ADD COLUMN     "biologyTargetId" TEXT NOT NULL,
ADD COLUMN     "chemistryTargetId" TEXT NOT NULL,
ADD COLUMN     "physicsTargetId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PhysicsTarget" (
    "id" TEXT NOT NULL,
    "chapterId" INTEGER NOT NULL,

    CONSTRAINT "PhysicsTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChemistryTarget" (
    "id" TEXT NOT NULL,
    "chapterId" INTEGER NOT NULL,

    CONSTRAINT "ChemistryTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiologyTarget" (
    "id" TEXT NOT NULL,
    "physicsChapterId" INTEGER NOT NULL,

    CONSTRAINT "BiologyTarget_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_physicsTargetId_fkey" FOREIGN KEY ("physicsTargetId") REFERENCES "PhysicsTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_chemistryTargetId_fkey" FOREIGN KEY ("chemistryTargetId") REFERENCES "ChemistryTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_biologyTargetId_fkey" FOREIGN KEY ("biologyTargetId") REFERENCES "BiologyTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicsTarget" ADD CONSTRAINT "PhysicsTarget_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "PhysicsSyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemistryTarget" ADD CONSTRAINT "ChemistryTarget_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "ChemistrySyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologyTarget" ADD CONSTRAINT "BiologyTarget_physicsChapterId_fkey" FOREIGN KEY ("physicsChapterId") REFERENCES "BiologySyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
