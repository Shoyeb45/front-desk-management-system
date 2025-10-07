/*
  Warnings:

  - Made the column `email` on table `patient` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."patient_email_key";

-- AlterTable
ALTER TABLE "patient" ALTER COLUMN "email" SET NOT NULL;
