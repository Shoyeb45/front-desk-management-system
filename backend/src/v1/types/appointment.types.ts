import z from "zod";
import { ZCreatePatient } from "./patient-queue.types";
import { AppointmentStatus } from "@prisma/client";

export const ZCreateAppointment = z.object({
    patient: ZCreatePatient,
    appointmentDate: z.preprocess(
        (val) => (typeof val === "string" ? new Date(val) : val),
        z.date()
    ),
    status: z.enum(AppointmentStatus).default(AppointmentStatus.BOOKED),
    doctorId: z.uuid()
});

export const ZEditAppointment = z.object({
    appointmentDate: z.preprocess(
        (val) => (typeof val === "string" ? new Date(val) : val),
        z.date()
    ).optional(),
    status: z.enum(AppointmentStatus).optional(),
    doctorId: z.uuid().optional()
});

export type TCreateAppointment = z.infer<typeof ZCreateAppointment>;
export type TEditAppointment = z.infer<typeof ZEditAppointment>;