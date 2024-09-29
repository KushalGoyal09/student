-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('Seesyallabus', 'UpdateSyallabus', 'AddSupervisor', 'AddSeniorMentor', 'AddGroupMentor', 'SeeAllSupervisor', 'SeeAllSeniorMentor', 'SeeAllGroupMentor', 'FeeManagement', 'KitDispatch', 'AssaignMentor');

-- DropForeignKey
ALTER TABLE "RatingByStudent" DROP CONSTRAINT "RatingByStudent_studentId_fkey";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "permission" "Permission"[] DEFAULT ARRAY[]::"Permission"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "RatingByStudent" ADD CONSTRAINT "RatingByStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
