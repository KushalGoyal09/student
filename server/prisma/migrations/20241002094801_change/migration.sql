/*
  Warnings:

  - The values [Admin] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('Supervisor', 'SeniorMentor', 'GroupMentor');
ALTER TABLE "Ticket" ALTER COLUMN "createdByRole" TYPE "Role_new" USING ("createdByRole"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "audioFile" TEXT;
