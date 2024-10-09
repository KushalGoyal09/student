/*
  Warnings:

  - The values [Seesyallabus,AddSupervisor,AddSeniorMentor,AddGroupMentor,SeeAllSupervisor,SeeAllSeniorMentor,SeeAllGroupMentor] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('UpdateSyallabus', 'FeeManagement', 'KitDispatch', 'AssaignMentor');
ALTER TABLE "User" ALTER COLUMN "permission" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "permission" TYPE "Permission_new"[] USING ("permission"::text::"Permission_new"[]);
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "Permission_old";
ALTER TABLE "User" ALTER COLUMN "permission" SET DEFAULT ARRAY[]::"Permission"[];
COMMIT;
