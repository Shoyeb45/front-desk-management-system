import z from "zod";

export const ZCreateDoctor = z.object({
    name: z.string().min(4),
    email: z.email(),
    phone: z.string().min(10).max(10),
    location: z.string().min(4),
    specialization: z.string().min(4),
    gender: z.enum(["MALE", "FEMALE"])
});


export type TCreateDoctor = z.infer<typeof ZCreateDoctor>;