/*
  Warnings:

  - You are about to drop the column `basePay` on the `MentorSalary` table. All the data in the column will be lost.
  - You are about to drop the column `perStudentPay` on the `MentorSalary` table. All the data in the column will be lost.
  - Added the required column `totalSalary` to the `MentorSalary` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `Role` on the `MentorSalary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SalaryRole" AS ENUM ('SeniorMentor', 'GroupMentor', 'Employee');

-- AlterTable
ALTER TABLE "MentorSalary" DROP COLUMN "basePay",
DROP COLUMN "perStudentPay",
ADD COLUMN     "bonus" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalSalary" INTEGER NOT NULL,
DROP COLUMN "Role",
ADD COLUMN     "Role" "SalaryRole" NOT NULL;

-- CreateTable
CREATE TABLE "Salary" (
    "id" TEXT NOT NULL,
    "Role" "SalaryRole" NOT NULL,
    "baseSalary" INTEGER NOT NULL DEFAULT 0,
    "perAj" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);
