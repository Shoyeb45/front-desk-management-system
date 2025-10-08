import { prisma } from "../../database/prisma";
import { TCreateAvailabilitySlot, TUpdateAvailabilitySlot } from "../types/doctor-availability.types";

export class DoctorAvailabilityRepository {
    static async createMany(doctorId: string, slots: TCreateAvailabilitySlot[]) {
        const data = slots.map(slot => ({
            doctorId,
            dayOfWeek: slot.dayOfWeek,
            availableFrom: slot.availableFrom,
            availableTo: slot.availableTo
        }));

        return await prisma.doctorAvailability.createMany({
            data,
            skipDuplicates: true,
        });
    }

    // Get all availability for a doctor
    static async getByDoctorId(doctorId: string) {
        return await prisma.doctorAvailability.findMany({
            where: { doctorId },
            orderBy: [
                { dayOfWeek: 'asc' },
                { availableFrom: 'asc' }
            ],
        });
    }


    static async getById(id: string) {
        return await prisma.doctorAvailability.findUnique({
            where: { id }
        });
    }

    static async updateById(id: string, data: TUpdateAvailabilitySlot) {
        const updateData: any = {};

        if (data.dayOfWeek) updateData.dayOfWeek = data.dayOfWeek;
        if (data.availableFrom) updateData.availableFrom = new Date(`1970-01-01T${data.availableFrom}:00Z`);
        if (data.availableTo) updateData.availableTo = new Date(`1970-01-01T${data.availableTo}:00Z`);

        return await prisma.doctorAvailability.update({
            where: { id },
            data: updateData,
        });
    }


    static async deleteById(id: string) {
        return await prisma.doctorAvailability.delete({
            where: { id }
        })
    }

    static async deleteAllByDoctorId(doctorId: string) {
        return await prisma.doctorAvailability.deleteMany({
            where: { doctorId },
        });
    }
}