import { prisma } from "../../database/prisma";
import { TCreatePatient } from "../types/patient-queue.types";

export class PatientRepository {
    static async create(data: TCreatePatient) {
        return prisma.patient.create({
            data
        });
    }

    static async getByEmail(email: string) {
        return await prisma.patient.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive',
                },
            },
        });
    }

    static async update(id: string, data: TCreatePatient) {
        return await prisma.patient.update({
            where: { id },
            data
        });
    }
}