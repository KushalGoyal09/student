/*
  Warnings:

  - You are about to drop the column `permissions` on the `Supervisor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Supervisor" DROP COLUMN "permissions",
ADD COLUMN     "AssaignMentor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "FeeManagement" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "KitDispatch" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "UpdateSyallabus" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "Permission";
