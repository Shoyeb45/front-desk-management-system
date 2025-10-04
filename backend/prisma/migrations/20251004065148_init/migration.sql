-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "QueueType" AS ENUM ('NORMAL', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "CurrentStatusType" AS ENUM ('WAITING', 'WITH_DOCTOR', 'DONE');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,

    CONSTRAINT "doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_queue" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "arrival_time" TIME(6) NOT NULL,
    "current_status" "CurrentStatusType" NOT NULL,
    "queue_type" "QueueType" NOT NULL,
    "doctor_id" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "patient_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_availability" (
    "id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "day_of_week" "DayOfWeek" NOT NULL,
    "available_from" TIME(6) NOT NULL,
    "available_to" TIME(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "doctor_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment" (
    "id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "appointment_date" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_email_key" ON "doctor"("email");

-- CreateIndex
CREATE INDEX "doctor_email_idx" ON "doctor"("email");

-- CreateIndex
CREATE INDEX "doctor_specialization_idx" ON "doctor"("specialization");

-- CreateIndex
CREATE UNIQUE INDEX "patient_email_key" ON "patient"("email");

-- CreateIndex
CREATE INDEX "patient_email_idx" ON "patient"("email");

-- CreateIndex
CREATE INDEX "patient_phone_idx" ON "patient"("phone");

-- CreateIndex
CREATE INDEX "patient_createdAt_idx" ON "patient"("createdAt");

-- CreateIndex
CREATE INDEX "patient_queue_patient_id_idx" ON "patient_queue"("patient_id");

-- CreateIndex
CREATE INDEX "patient_queue_doctor_id_idx" ON "patient_queue"("doctor_id");

-- CreateIndex
CREATE INDEX "patient_queue_current_status_idx" ON "patient_queue"("current_status");

-- CreateIndex
CREATE INDEX "patient_queue_queue_type_idx" ON "patient_queue"("queue_type");

-- CreateIndex
CREATE INDEX "patient_queue_createdAt_idx" ON "patient_queue"("createdAt");

-- CreateIndex
CREATE INDEX "doctor_availability_doctor_id_idx" ON "doctor_availability"("doctor_id");

-- CreateIndex
CREATE INDEX "doctor_availability_day_of_week_idx" ON "doctor_availability"("day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_availability_doctor_id_day_of_week_available_from_av_key" ON "doctor_availability"("doctor_id", "day_of_week", "available_from", "available_to");

-- CreateIndex
CREATE INDEX "appointment_doctor_id_idx" ON "appointment"("doctor_id");

-- CreateIndex
CREATE INDEX "appointment_patient_id_idx" ON "appointment"("patient_id");

-- CreateIndex
CREATE INDEX "appointment_appointment_date_idx" ON "appointment"("appointment_date");

-- CreateIndex
CREATE INDEX "appointment_doctor_id_appointment_date_idx" ON "appointment"("doctor_id", "appointment_date");

-- AddForeignKey
ALTER TABLE "patient_queue" ADD CONSTRAINT "patient_queue_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_queue" ADD CONSTRAINT "patient_queue_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_availability" ADD CONSTRAINT "doctor_availability_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
