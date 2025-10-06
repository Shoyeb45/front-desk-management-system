import { Response } from "express";
import { TCreateAvailabilitySlot, TCreateDoctorAvailability, TUpdateAvailabilitySlot } from "../types/doctor-availability.types";
import { DoctorRepository } from "../repositories/doctor.repository";
import { HTTP_STATUS } from "../../utils/httpCodes";
import { ApiError } from "../../utils/ApiError";
import { DoctorAvailabilityRepository } from "../repositories/doctor-availability.repository";
import { ApiResponse } from "../../utils/ApiResponse";

export class DoctorAvailabilityService {
    static async createDoctorAvailability(data: TCreateDoctorAvailability, res: Response) {
        const doctorExists = await DoctorRepository.getDoctorById(data.doctorId);
        if (!doctorExists) {
            throw new ApiError("Doctor not found", HTTP_STATUS.NOT_FOUND);
        }

        for (const slot of data.availability) {
            const from = slot.availableFrom.split(':').map(Number);
            const to = slot.availableTo.split(':').map(Number);

            const fromMinutes = from[0] * 60 + from[1];
            const toMinutes = to[0] * 60 + to[1];

            if (fromMinutes >= toMinutes) {
                throw new ApiError(`Invalid time range for ${slot.dayOfWeek}: 'availableTo' must be after 'availableFrom'`);
            }
        }

        const result = await DoctorAvailabilityRepository.createMany(data.doctorId, data.availability);

        if (result.count === 0) {
            throw new ApiError("Failed to create availability slots. They might already exist.");
        }

        const doctorAvailability = await DoctorAvailabilityRepository.getByDoctorId(data.doctorId);
        ApiResponse.success(res, {
            availability: doctorAvailability
        }, "Doctor availability created successfully.");
    }

    static async getDoctorAvailability(doctorId: string, res: Response) {
        const doctorExists = await DoctorRepository.getDoctorById(doctorId);
        if (!doctorExists) {
            throw new ApiError("Doctor not found", HTTP_STATUS.NOT_FOUND);
        }

        const availability = await DoctorAvailabilityRepository.getByDoctorId(doctorId);

        // Format the response to make times readable
        const formattedAvailability = availability.map(slot => ({
            id: slot.id,
            doctorId: slot.doctorId,
            dayOfWeek: slot.dayOfWeek,
            availableFrom: slot.availableFrom.toISOString().substr(11, 5), // Extract HH:MM
            availableTo: slot.availableTo.toISOString().substr(11, 5),
            createdAt: slot.createdAt,
            updatedAt: slot.updatedAt,
        }));

        ApiResponse.success(
            res,
            { availability: formattedAvailability },
            "Doctor availability fetched successfully",
            HTTP_STATUS.OK
        );
    }

    static async updateAvailability(slotId: string, data: TUpdateAvailabilitySlot, res: Response) {
        if (!slotId) {
            throw new ApiError("Slot id not found.")
        }
        const existingSlot = await DoctorAvailabilityRepository.getById(slotId);

        if (!existingSlot) {
            throw new ApiError("No slot found with given slotId.");
        }

        if (data.availableFrom || data.availableTo) {
            const fromTime = data.availableFrom || existingSlot.availableFrom.toISOString().substr(11, 5);
            const toTime = data.availableTo || existingSlot.availableTo.toISOString().substr(11, 5);

            const from = fromTime.split(':').map(Number);
            const to = toTime.split(':').map(Number);

            const fromMinutes = from[0] * 60 + from[1];
            const toMinutes = to[0] * 60 + to[1];

            if (fromMinutes >= toMinutes) {
                throw new ApiError("Invalid time range: 'availableTo' must be after 'availableFrom'");
            }
        }
        const updated = await DoctorAvailabilityRepository.updateById(slotId, data);

        const formattedSlot = {
            id: updated.id,
            doctorId: updated.doctorId,
            dayOfWeek: updated.dayOfWeek,
            availableFrom: updated.availableFrom.toISOString().substr(11, 5),
            availableTo: updated.availableTo.toISOString().substr(11, 5),
            updatedAt: updated.updatedAt,
        };

        ApiResponse.success(res, formattedSlot, "Availability slot updated successfully", HTTP_STATUS.OK);
    }

    static async deleteAvailability(slotId: string, res: Response) {
        const existingSlot = await DoctorAvailabilityRepository.getById(slotId);
        if (!existingSlot) {
            throw new ApiError("Availability slot not found", HTTP_STATUS.NOT_FOUND);
        }

        await DoctorAvailabilityRepository.deleteById(slotId);

        ApiResponse.success(res, null, "Availability slot deleted successfully", HTTP_STATUS.OK);
    }

    static async replaceAvailability(data: TCreateDoctorAvailability, res: Response) {
        const doctorExists = await DoctorRepository.getDoctorById(data.doctorId);
        if (!doctorExists) {
            throw new ApiError("Doctor not found", HTTP_STATUS.NOT_FOUND);
        }

        // Delete existing availability
        await DoctorAvailabilityRepository.deleteAllByDoctorId(data.doctorId);

        // Create new availability
        await DoctorAvailabilityRepository.createMany(data.doctorId, data.availability);

        const newAvailability = await DoctorAvailabilityRepository.getByDoctorId(data.doctorId);

        ApiResponse.success(
            res,
            { availability: newAvailability },
            "Doctor availability replaced successfully",
            HTTP_STATUS.OK
        );
    }
}