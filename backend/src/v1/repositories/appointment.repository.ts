import { prisma } from "../../database/prisma";
import { getTodaysDateAttachedWithTime } from "../../utils/helper";
import { TCreateAppointment, TEditAppointment } from "../types/appointment.types";

export class AppointmentRepository {
    static async create(data: Omit<TCreateAppointment, "patient">, patientId: string) {
        data.appointmentDate = getTodaysDateAttachedWithTime(data.appointmentDate);
        return await prisma.appointment.create({
            data: {
                ...data, patientId
            }
        });
    }

    static async update(id: string, data: TEditAppointment) {
        if (data.appointmentDate) {
            data.appointmentDate = getTodaysDateAttachedWithTime(data.appointmentDate);
        }
        return await prisma.appointment.update({
            where: { id },
            data
        });
    }

    static async isExists(id: string) {
        return await prisma.appointment.findUnique({ where: { id }, select: { id: true }});
    }
    
    static async deleteById(id: string) {
        return await prisma.appointment.delete({
            where: { id }
        });
    }

    static async getTodaysAppointments() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        return await prisma.appointment.findMany({
            where: {
                createdAt: {
                    gte: todayStart, lte: todayEnd
                }
            }, select: {
                id: true, doctor: {
                    select: {
                        id: true, name: true, specialization: true
                    }
                }, patient: {
                    select: {
                        id: true, name: true, email: true, age: true, gender: true
                    }
                }, status: true, appointmentDate: true, createdAt: true, updatedAt: true
            }, orderBy: {
                appointmentDate: "asc"
            }
        });
    }

    static async getPastAppointments() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        return await prisma.appointment.findMany({
            where: {
                createdAt: {
                    lt: todayStart
                }
            }, select: {
                id: true, doctor: {
                    select: {
                        id: true, name: true, specialization: true
                    }
                }, patient: {
                    select: {
                        id: true, name: true, email: true, age: true, gender: true
                    }
                }, status: true, appointmentDate: true, createdAt: true, updatedAt: true
            }, orderBy: {
                appointmentDate: "asc"
            }
        });
    }
}