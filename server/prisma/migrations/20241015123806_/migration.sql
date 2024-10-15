/*
  Warnings:

  - A unique constraint covering the columns `[Role]` on the table `Salary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Salary_Role_key" ON "Salary"("Role");
