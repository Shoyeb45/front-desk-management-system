import { Gender } from "@prisma/client";
import z from "zod";

export const ZCreateDoctor = z.object({
    name: z.string().min(4),
    email: z.email(),
    phone: z.string().min(10).max(10),
    location: z.string().min(4),
    specialization: z.string().min(4),
    gender: z.enum(Gender)
});

export const ZEditDoctor = z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    specialization: z.string().optional(),
    gender: z.enum(Gender).optional()
});


export type TCreateDoctor = z.infer<typeof ZCreateDoctor>;
export type TEditDoctor = z.infer<typeof ZEditDoctor>;