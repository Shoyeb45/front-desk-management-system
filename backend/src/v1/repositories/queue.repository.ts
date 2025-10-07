import { Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma";
import { TCreateQueue } from "../types/patient-queue.types";
import { getTodaysDateAttachedWithTime } from "../../utils/helper";

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
                id: true, arrivalTime: true, queueType: true, currentStatus: true,
                patient: {
                    select: {
                        id: true, name: true, email: true
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
                id: true, arrivalTime: true, queueType: true, currentStatus: true,
                patient: {
                    select: {
                        id: true, name: true, email: true
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
}