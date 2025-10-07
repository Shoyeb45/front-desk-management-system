import z from "zod";

export const ZUuid = z.object({
    id: z.uuid()
});

