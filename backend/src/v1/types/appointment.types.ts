import z from "zod";
import { ZCreatePatient } from "./patient-queue.types";
import { AppointmentStatus } from "@prisma/client";

export const ZCreateAppointment = z.object({
    patient: ZCreatePatient,
    appointmentDate: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM"),
    status: z.enum(AppointmentStatus).default(AppointmentStatus.BOOKED),
    doctorId: z.uuid()
});

export const ZEditAppointment = z.object({
    appointmentDate: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM").optional(),
    status: z.enum(AppointmentStatus).optional(),
    doctorId: z.uuid().optional()
});

export type TCreateAppointment = z.infer<typeof ZCreateAppointment>;
export type TEditAppointment = z.infer<typeof ZEditAppointment>;