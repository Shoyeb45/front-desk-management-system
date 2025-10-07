import { Response } from "express";
import { TCreateQueue, TCreateQueuePatient } from "../types/patient-queue.types";
import { ApiResponse } from "../../utils/ApiResponse";
import { PatientRepository } from "../repositories/patient.repository";
import { ApiError } from "../../utils/ApiError";
import { QueueRepository } from "../repositories/queue.repository";
import { HTTP_STATUS } from "../../utils/httpCodes";
import { logger } from "../../utils/logger";
import { addMinutes } from 'date-fns';
import { CurrentStatusType, QueueType } from "@prisma/client";

export class PatientQueueService {
    static async createQueue(queueData: TCreateQueuePatient, res: Response) {
        if (!queueData?.patientId && !queueData?.patient) {
            throw new ApiError("Both patient data and id is not present.")
        }
        logger.info("Received request to add patient into queue.");


        let patient = await PatientRepository.getByEmail(queueData.patient.email);

        if (!patient) {
            logger.info("Patient doesn't existing creating new one.");
            patient = await PatientRepository.create(queueData.patient);
        } else {
            logger.info("Patient exists, updating with new data.");
            patient = await PatientRepository.update(patient.id, queueData.patient);
        }
        logger.info("Creating a patient..");
        if (!patient) {
            throw new ApiError("Failed to add patient into queue, please try once again.");
        }
        queueData.queue.patientId = patient.id;

        logger.info("Adding patient into queue.");
        const queue = await QueueRepository.create(queueData.queue);

        if (!queue) {
            throw new ApiError("Failed to add patient into queue, please try once more.");
        }
        ApiResponse.success(res, queue, "Successfully added patient into queue.", HTTP_STATUS.OK);
    }

    static async getPatient(email: string, res: Response) {
        if (!email || !email.trim()) {
            throw new ApiError("No email found.");
        }
        const patientData = await PatientRepository.getByEmail(email);
        ApiResponse.success(res, patientData, "Fetched patient successfully.", HTTP_STATUS.OK);
    }

    static async getPatientQueueList(filter: string, res: Response) {
        if (!filter || (filter !== "TODAY" && filter !== "PAST")) {
            throw new ApiError("No correct filter, passed. Invalid request.", HTTP_STATUS.BAD_REQUEST);
        }

        if (filter === "TODAY") {
            const data = await QueueRepository.getTodaysList();
            if (!data) {
                throw new ApiError("Failed to get today's patient list, please try again.");
            }
            const groupedByDoctor = data.reduce((acc, q) => {
                const key = q.doctor?.id || 'unassigned';
                acc[key] = acc[key] || [];
                acc[key].push(q);
                return acc;
            }, {} as Record<string, typeof data>);

            const avgConsultation = 15;
            const expectedTimes: {
                id: string;
                createdAt: Date;
                doctor: {
                    name: string;
                    id: string;
                    specialization: string;
                } | null;
                patient: {
                    name: string;
                    id: string;
                    email: string | null;
                };
                arrivalTime: Date;
                currentStatus: CurrentStatusType;
                queueType: QueueType;
                expectedTime: String
            }[]
                = [];
            
            for (const [_doctorId, patients] of Object.entries(groupedByDoctor)) {
                patients.forEach((p, index) => {
                    if (p.currentStatus === "WAITING") {
                        const expectedTime = addMinutes(p.arrivalTime, index * avgConsultation);
                        expectedTimes.push({
                            ...p,
                            expectedTime: `${expectedTime.getHours()}:${expectedTime.getMinutes()}`,
                        });
                    } else {
                        expectedTimes.push({
                            ...p,
                            expectedTime: `00:00`,
                        });

                    }
                });
            }

            ApiResponse.success(res, expectedTimes, "Successfully fetched all the patient list in the queue for today.", HTTP_STATUS.OK);
            return;
        }

        const data = await QueueRepository.getPastListExcludingToday();

        if (!data) {
            throw new ApiError("Failed to get past patient list, please try again.");
        }

        ApiResponse.success(res, data, "Successfully fetched all the past patients list.", HTTP_STATUS.OK);
    }
}