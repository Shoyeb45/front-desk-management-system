import { endOfToday, startOfToday } from "date-fns";
import { prisma } from "../../database/prisma";
import { TCreateAppointment, TEditAppointment } from "../types/appointment.types";

export class AppointmentRepository {
    static async create(data: Omit<TCreateAppointment, "patient">, patientId: string) {
        return await prisma.appointment.create({
            data: {
                ...data, patientId
            }
        });
    }

    static async update(id: string, data: TEditAppointment) {
        return await prisma.appointment.update({
            where: { id },
            data
        });
    }

    static async isExists(id: string) {
        return await prisma.appointment.findUnique({ where: { id }, select: { id: true } });
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

    static async getTodaysStats() {
        const today = startOfToday(), end = endOfToday();

        const [totalAppointmentsToday, doneCount, confirmedCount, upcomingCount] = await prisma.$transaction([
            prisma.appointment.count({
                where: {
                    appointmentDate: { gte: today, lte: end },
                }
            }),
            prisma.appointment.count({
                where: {
                    appointmentDate: { gte: today, lte: end },
                    status: "DONE"
                }
            }),
            prisma.appointment.count({
                where: {
                    appointmentDate: { gte: today, lte: end },
                    status: "CONFIRMED"
                }
            }),
            prisma.appointment.count({
                where: {
                    appointmentDate: { gt: today },
                    OR: [
                        { status: "BOOKED" },
                        { status: "CONFIRMED" },
                    ]
                }
            })
        ]);

        return {
            totalAppointmentsToday, doneCount, confirmedCount, upcomingCount
        };
    }
}