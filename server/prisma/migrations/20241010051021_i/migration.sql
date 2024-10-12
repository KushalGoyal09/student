/*
  Warnings:

  - A unique constraint covering the columns `[studentId,date]` on the table `Target` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Target_studentId_date_key" ON "Target"("studentId", "date");
