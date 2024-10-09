-- CreateEnum
CREATE TYPE "Month" AS ENUM ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

-- CreateTable
CREATE TABLE "MentorSalary" (
    "id" TEXT NOT NULL,
    "Role" "Role" NOT NULL,
    "userId" TEXT NOT NULL,
    "month" "Month" NOT NULL,
    "year" INTEGER NOT NULL,
    "basePay" INTEGER NOT NULL,
    "perStudentPay" INTEGER NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MentorSalary_pkey" PRIMARY KEY ("id")
);
