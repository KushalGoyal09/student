/*
  Warnings:

  - Made the column `city` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `completeAddress` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `landmark` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pincode` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "completeAddress" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "landmark" SET NOT NULL,
ALTER COLUMN "pincode" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL;
