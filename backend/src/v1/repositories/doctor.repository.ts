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
            id: true, name: true, email: true, specialization: true
        }});
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
}