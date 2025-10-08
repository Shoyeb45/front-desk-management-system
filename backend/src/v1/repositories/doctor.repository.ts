import { prisma } from "../../database/prisma";
import { getDayOfWeekEnum } from "../../utils/helper";
import { TCreateDoctor, TEditDoctor } from "../types/doctor.type";

export class DoctorRepository {
    static async create(data: TCreateDoctor) {
        return await prisma.doctor.create({
            data
        });
    }

    static async getDoctorById(id: string) {
        return prisma.doctor.findUnique({
            where: { id }
        });
    }

    static async getAllDoctor() {
        return await prisma.doctor.findMany({
            select: {
                id: true, name: true, email: true, specialization: true
            }
        });
    }

    static async deleteById(id: string) {
        return await prisma.doctor.delete({
            where: { id }
        });
    }

    static async edit(id: string, data: TEditDoctor) {
        return await prisma.doctor.update({
            where: { id },
            data
        });
    }


    static async getAvailableDoctorsForTime(date: Date, time: string) {
        // time -> HH:MM
        const [hours, minutes] = time.split(":").map(Number);
        // const timeToCompare = new Date(0, 0, 1, hours, minutes, 0); // dummy date, only time matters
        // console.log(timeToCompare);
        console.log(getDayOfWeekEnum(date));

        const availableDoctors = await prisma.doctor.findMany({
            where: {
                doctorAvailability: {
                    some: {
                        dayOfWeek: getDayOfWeekEnum(date),
                        availableFrom: { lte: time },
                        availableTo: { gte: time },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                specialization: true
            }
        });

        return availableDoctors;
    }

}