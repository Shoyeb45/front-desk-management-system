/*
  Warnings:

  - You are about to drop the column `available_from` on the `doctor_availability` table. All the data in the column will be lost.
  - You are about to drop the column `available_to` on the `doctor_availability` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[doctor_id,day_of_week,availableFrom,availableTo]` on the table `doctor_availability` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `availableFrom` to the `doctor_availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableTo` to the `doctor_availability` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."doctor_availability_doctor_id_day_of_week_available_from_av_key";

-- AlterTable
ALTER TABLE "doctor_availability" DROP COLUMN "available_from",
DROP COLUMN "available_to",
ADD COLUMN     "availableFrom" TEXT NOT NULL,
ADD COLUMN     "availableTo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "doctor_availability_doctor_id_day_of_week_availableFrom_ava_key" ON "doctor_availability"("doctor_id", "day_of_week", "availableFrom", "availableTo");
