import { prisma } from "../../database/prisma";
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
        return await prisma.doctor.findMany({select: {
            id: true, name: true, email: true   
        }});
    }

    static async deleteById(id: string) {
        return await prisma.doctor.delete({
            where: { id }
        });
    }

    static async getCompleteDoctorById(id: string) {
        return await prisma.doctor.findUnique({
            where: { id },
            select: {
                id: true, name: true, email: true, phone: true, location: true, specialization: true, gender: true, doctorAvailability: {
                    select: {
                        dayOfWeek: true,
                        availableFrom: true,
                        availableTo: true
                    }
                }
            }
        });
    }

    static async edit(id: string, data: TEditDoctor) {
        return await prisma.doctor.update({
            where: { id },
            data
        });
    }
}