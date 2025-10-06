// src/doctor/types/doctor-availability.type.ts
import { z } from "zod";
import { DayOfWeek } from "@prisma/client";

export const ZCreateAvailabilitySlot = z.object({
  dayOfWeek: z.enum(DayOfWeek),
  availableFrom: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM"),
  availableTo: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM"),
});

export const ZCreateDoctorAvailability = z.object({
  doctorId: z.uuid("Invalid doctor ID"),
  availability: z.array(ZCreateAvailabilitySlot).min(1, "At least one availability slot is required"),
});

export const ZUpdateAvailabilitySlot = z.object({
  dayOfWeek: z.enum(DayOfWeek).optional(),
  availableFrom: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM").optional(),
  availableTo: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format. Use HH:MM").optional(),
});

export type TCreateAvailabilitySlot = z.infer<typeof ZCreateAvailabilitySlot>;
export type TCreateDoctorAvailability = z.infer<typeof ZCreateDoctorAvailability>;
export type TUpdateAvailabilitySlot = z.infer<typeof ZUpdateAvailabilitySlot>;