import z from "zod";

export const ZLogin = z.object({
    email: z.email(),
    password: z.string(),
    role: z.enum(["STAFF", "ADMIN"])
});

export type TLogin = z.infer<typeof ZLogin>;