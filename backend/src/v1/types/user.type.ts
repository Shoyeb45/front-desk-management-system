import { Gender, Role } from "@prisma/client";
import z from "zod";

export const ZUserCreate = z.object({
    name: z.string().min(1, "Atleast 1 sized named required."),
    email: z.email(),
    password: z.string(),
    role: z.enum(Role),
    gender: z.enum(Gender)
});

export const ZUserEdit = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    gender: z.enum(Gender).optional()
});

export type TUserEdit = z.infer<typeof ZUserEdit>;
export type TUserCreate = z.infer<typeof ZUserCreate>; 