-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('BOOKED', 'CONFIRMED', 'CANCELLED', 'DONE', 'NO_SHOW');

-- AlterTable
ALTER TABLE "appointment" ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'BOOKED';

-- CreateIndex
CREATE INDEX "appointment_status_idx" ON "appointment"("status");
