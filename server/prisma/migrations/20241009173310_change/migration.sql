/*
  Warnings:

  - You are about to drop the column `biologyTargetId` on the `Target` table. All the data in the column will be lost.
  - You are about to drop the column `chemistryTargetId` on the `Target` table. All the data in the column will be lost.
  - You are about to drop the column `physicsTargetId` on the `Target` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Target" DROP CONSTRAINT "Target_biologyTargetId_fkey";

-- DropForeignKey
ALTER TABLE "Target" DROP CONSTRAINT "Target_chemistryTargetId_fkey";

-- DropForeignKey
ALTER TABLE "Target" DROP CONSTRAINT "Target_physicsTargetId_fkey";

-- AlterTable
ALTER TABLE "BiologyTarget" ADD COLUMN     "targetId" TEXT;

-- AlterTable
ALTER TABLE "ChemistryTarget" ADD COLUMN     "targetId" TEXT;

-- AlterTable
ALTER TABLE "PhysicsTarget" ADD COLUMN     "targetId" TEXT;

-- AlterTable
ALTER TABLE "Supervisor" ADD COLUMN     "permissions" "Permission"[];

-- AlterTable
ALTER TABLE "Target" DROP COLUMN "biologyTargetId",
DROP COLUMN "chemistryTargetId",
DROP COLUMN "physicsTargetId";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "PhysicsVisionBoard" (
    "id" TEXT NOT NULL,
    "notes" BOOLEAN NOT NULL,
    "leacture" BOOLEAN NOT NULL,
    "ncert" BOOLEAN NOT NULL,
    "QP" BOOLEAN NOT NULL,
    "revision" BOOLEAN NOT NULL,
    "vivas" BOOLEAN NOT NULL,
    "studentId" TEXT NOT NULL,
    "physicsSyallabusId" INTEGER NOT NULL,

    CONSTRAINT "PhysicsVisionBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChemistryVisionBoard" (
    "id" TEXT NOT NULL,
    "notes" BOOLEAN NOT NULL,
    "leacture" BOOLEAN NOT NULL,
    "ncert" BOOLEAN NOT NULL,
    "QP" BOOLEAN NOT NULL,
    "revision" BOOLEAN NOT NULL,
    "vivas" BOOLEAN NOT NULL,
    "studentId" TEXT NOT NULL,
    "physicsSyallabusId" INTEGER NOT NULL,

    CONSTRAINT "ChemistryVisionBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiologyVisionBoard" (
    "id" TEXT NOT NULL,
    "notes" BOOLEAN NOT NULL,
    "leacture" BOOLEAN NOT NULL,
    "ncert" BOOLEAN NOT NULL,
    "QP" BOOLEAN NOT NULL,
    "revision" BOOLEAN NOT NULL,
    "vivas" BOOLEAN NOT NULL,
    "studentId" TEXT NOT NULL,
    "physicsSyallabusId" INTEGER NOT NULL,

    CONSTRAINT "BiologyVisionBoard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhysicsVisionBoard_studentId_physicsSyallabusId_key" ON "PhysicsVisionBoard"("studentId", "physicsSyallabusId");

-- CreateIndex
CREATE UNIQUE INDEX "ChemistryVisionBoard_studentId_physicsSyallabusId_key" ON "ChemistryVisionBoard"("studentId", "physicsSyallabusId");

-- CreateIndex
CREATE UNIQUE INDEX "BiologyVisionBoard_studentId_physicsSyallabusId_key" ON "BiologyVisionBoard"("studentId", "physicsSyallabusId");

-- AddForeignKey
ALTER TABLE "PhysicsVisionBoard" ADD CONSTRAINT "PhysicsVisionBoard_physicsSyallabusId_fkey" FOREIGN KEY ("physicsSyallabusId") REFERENCES "PhysicsSyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicsVisionBoard" ADD CONSTRAINT "PhysicsVisionBoard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemistryVisionBoard" ADD CONSTRAINT "ChemistryVisionBoard_physicsSyallabusId_fkey" FOREIGN KEY ("physicsSyallabusId") REFERENCES "ChemistrySyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemistryVisionBoard" ADD CONSTRAINT "ChemistryVisionBoard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologyVisionBoard" ADD CONSTRAINT "BiologyVisionBoard_physicsSyallabusId_fkey" FOREIGN KEY ("physicsSyallabusId") REFERENCES "BiologySyallabus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologyVisionBoard" ADD CONSTRAINT "BiologyVisionBoard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicsTarget" ADD CONSTRAINT "PhysicsTarget_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChemistryTarget" ADD CONSTRAINT "ChemistryTarget_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiologyTarget" ADD CONSTRAINT "BiologyTarget_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE SET NULL ON UPDATE CASCADE;
