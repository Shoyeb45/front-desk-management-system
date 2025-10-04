import z from "zod";

export const ZUserCreate = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
    role: z.enum(["ADMIN", "STAFF"])
});

export type TUserCreate = z.infer<typeof ZUserCreate>; 