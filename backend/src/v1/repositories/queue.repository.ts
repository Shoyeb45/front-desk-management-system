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
}