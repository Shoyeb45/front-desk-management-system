import { CurrentStatusType, Gender, QueueType } from "@prisma/client";
import z from "zod";

export const ZCreatePatient = z.object({
    name: z.string(),
    email: z.email(),
    phone: z.string().optional(),
    age: z.number(),
    gender: z.enum(Gender),
    address: z.string().optional(),
});
export const ZCreateQueue = z.object({
    arrivalTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM"),
    currentStatus: z.enum(CurrentStatusType).default(CurrentStatusType.WAITING),
    queueType: z.enum(QueueType),
    doctorId: z.uuid().optional(),
    patientId: z.uuid().optional()
});

export const ZCreateQueuePatient = z.object({
    patient: ZCreatePatient,
    patientId: z.uuid().optional(),    
    queue: ZCreateQueue
});

export const ZPatientQueueEdit = z.object({
    currentStatus: z.enum(CurrentStatusType).optional(),
    queueType: z.enum(QueueType).optional()
});

export type TCreateQueuePatient = z.infer<typeof ZCreateQueuePatient>;
export type TCreatePatient = z.infer<typeof ZCreatePatient>;
export type TCreateQueue = z.infer<typeof ZCreateQueue>;
export type TPatientQueueEdit = z.infer<typeof ZPatientQueueEdit>;