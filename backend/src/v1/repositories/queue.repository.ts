import { Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma";
import { TCreateQueue, TPatientQueueEdit } from "../types/patient-queue.types";
import { getTodaysDateAttachedWithTime } from "../../utils/helper";
import { endOfDay, startOfDay } from "date-fns";

export class QueueRepository {
    static async create(data: TCreateQueue) {
        data.arrivalTime = getTodaysDateAttachedWithTime(data.arrivalTime);

        return await prisma.patientQueue.create({
            data: {
                ...data
            } as Prisma.PatientQueueUncheckedCreateInput
        });
    }

    static async getTodaysList() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        return await prisma.patientQueue.findMany({
            where: {
                createdAt: {
                    gte: todayStart,
                    lte: todayEnd,
                },
                currentStatus: {
                    in: ["WAITING", "WITH_DOCTOR", "DONE"],
                },
            },
            select: {
                id: true, arrivalTime: true, queueType: true, currentStatus: true, updatedAt: true,
                patient: {
                    select: {
                        id: true, name: true, email: true, age: true, gender: true
                    }

                },
                doctor: {
                    select: {
                        id: true, name: true, specialization: true
                    }
                },
                createdAt: true
            },
            orderBy: {
                arrivalTime: "asc",
            },
        });
    }

    static async getPastListExcludingToday() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        return await prisma.patientQueue.findMany({
            where: {
                createdAt: {
                    lt: todayStart,
                },
            },
            select: {
                id: true, arrivalTime: true, queueType: true, currentStatus: true, updatedAt: true,
                patient: {
                    select: {
                        id: true, name: true, email: true, age: true, gender: true
                    }

                },
                doctor: {
                    select: {
                        id: true, name: true, specialization: true
                    }
                },
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

    }


    static async deleteById(id: string) {
        return await prisma.patientQueue.delete({ where: { id } });
    }

    static async existById(id: string) {
        return await prisma.patientQueue.findFirst({ where: { id }, select: { id: true, doctorId: true } });
    }

    static async updateById(id: string, data: TPatientQueueEdit) {
        return await prisma.patientQueue.update({
            where: { id },
            data
        });
    }

    static async getTodaysWithDoctorPatient(doctorId: string) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        return await prisma.patientQueue.findMany({
            where: {
                currentStatus: "WITH_DOCTOR",
                createdAt: {
                    gte: todayStart
                },
                doctorId
            }, select: {
                id: true
            }
        })
    }


    static async getTodaysStats() {
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        const [totalQueueToday, completedCount, waitingCount, emergencyCount] =
            await prisma.$transaction([
                prisma.patientQueue.count({
                    where: { createdAt: { gte: todayStart, lte: todayEnd } },
                }),
                prisma.patientQueue.count({
                    where: {
                        createdAt: { gte: todayStart, lte: todayEnd },
                        currentStatus: "DONE",
                    },
                }),
                prisma.patientQueue.count({
                    where: {
                        createdAt: { gte: todayStart, lte: todayEnd },
                        currentStatus: "WAITING",
                    },
                }),
                prisma.patientQueue.count({
                    where: {
                        createdAt: { gte: todayStart, lte: todayEnd },
                        queueType: "EMERGENCY",
                    },
                }),
            ]);
        
        return {
            totalQueueToday, completedCount, waitingCount, emergencyCount
        };
    }
}   