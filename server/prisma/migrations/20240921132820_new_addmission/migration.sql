-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "dateOfDeactive" TIMESTAMP(3),
ADD COLUMN     "kitDispatched" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Fees" (
    "id" TEXT NOT NULL,
    "feesPlan" INTEGER NOT NULL DEFAULT 1,
    "allClear" BOOLEAN NOT NULL DEFAULT false,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "Fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mode" TEXT NOT NULL,
    "feesId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fees_studentId_key" ON "Fees"("studentId");

-- AddForeignKey
ALTER TABLE "Fees" ADD CONSTRAINT "Fees_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_feesId_fkey" FOREIGN KEY ("feesId") REFERENCES "Fees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
