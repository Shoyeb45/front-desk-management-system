import { prisma } from "../../database/prisma";
import { TCreateDoctor } from "../types/doctor.type";

export class DoctorRepository {
    static async create(data: TCreateDoctor) {
        return await prisma.doctor.create({
            data
        });
    } 


    static async getAllDoctor() {
        return await prisma.doctor.findMany({select: {
            id: true, name: true, email: true   
        }});
    }
}