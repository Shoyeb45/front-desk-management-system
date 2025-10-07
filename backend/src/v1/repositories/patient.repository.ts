import { Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma";
import { removeKeys } from "../../utils/helper";
import { TCreatePatient } from "../types/patient-queue.types";

export class PatientRepository {
    static async create(patientData: TCreatePatient) {
        const data = removeKeys(patientData, ["isNewPatientNeeded"]);
        return prisma.patient.create({
            data: {
                ...data
            } as Prisma.PatientUncheckedCreateInput
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
    
    static async update(id: string, patientData: TCreatePatient) {
        const data = removeKeys(patientData, ["isNewPatientNeeded"]);
        return await prisma.patient.update({
            where: { id },
            data
        });
    }
}