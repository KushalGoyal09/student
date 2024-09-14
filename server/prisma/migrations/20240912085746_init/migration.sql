/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `GroupMentor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `SeniorMentor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Supervisor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GroupMentor_username_key" ON "GroupMentor"("username");

-- CreateIndex
CREATE UNIQUE INDEX "SeniorMentor_username_key" ON "SeniorMentor"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Supervisor_username_key" ON "Supervisor"("username");
