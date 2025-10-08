import { Response } from "express";
import { TCreateQueue, TCreateQueuePatient, TPatientQueueEdit } from "../types/patient-queue.types";
import { ApiResponse } from "../../utils/ApiResponse";
import { PatientRepository } from "../repositories/patient.repository";
import { ApiError } from "../../utils/ApiError";
import { QueueRepository } from "../repositories/queue.repository";
import { HTTP_STATUS } from "../../utils/httpCodes";
import { logger } from "../../utils/logger";
import { addMinutes } from 'date-fns';
import { CurrentStatusType, QueueType } from "@prisma/client";
import z from "zod";
import { ZUuid } from "../types/shared.types";
import { removeKeys } from "../../utils/helper";

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
            if (queueData.patient.isNewPatientNeeded) {
                logger.info("Staff request for new patient, creating new one.");
                patient = await PatientRepository.create(queueData.patient);
            } else {
                logger.info("Patient exists, updating with new data.");
                patient = await PatientRepository.update(patient.id, queueData.patient);
            }
        }
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

    /**
     * Function to get patient list with expected time for Today's data.
     * @param filter 
     * @param res 
     * @returns 
     */
    static async getPatientQueueList(filter: string, res: Response) {
        if (!filter || (filter !== "TODAY" && filter !== "PAST")) {
            throw new ApiError("No correct filter, passed. Invalid request.", HTTP_STATUS.BAD_REQUEST);
        }

        if (filter === "TODAY") {
            const data = await QueueRepository.getTodaysList();
            if (!data) {
                throw new ApiError("Failed to get today's patient list, please try again.");
            }

            const AVG_CONSULTATION_MINUTES = 15;

            // Group by doctor (or 'unassigned')
            const groupedByDoctor = data.reduce((acc, q) => {
                const key = q.doctor?.id || 'unassigned';
                if (!acc[key]) acc[key] = [];
                acc[key].push(q);
                return acc;
            }, {} as Record<string, typeof data>);

            const result: (typeof data[0] & { expectedTime?: Date })[] = [];

            for (const [doctorId, patients] of Object.entries(groupedByDoctor)) {
                // Sort patients for this doctor:
                // 1. BY STATUS: WITH_DOCTOR -> WAITING -> DONE
                // 2. WITHIN WAITING: EMERGENCY before NORMAL
                // 3. THEN by arrivalTime (or updatedAt for emergencies?)
                const sortedPatients = [...patients].sort((a, b) => {
                    const statusPriority = {
                        [CurrentStatusType.WITH_DOCTOR]: 0,
                        [CurrentStatusType.WAITING]: 1,
                        [CurrentStatusType.DONE]: 2,
                    };

                    if (statusPriority[a.currentStatus] !== statusPriority[b.currentStatus]) {
                        return statusPriority[a.currentStatus] - statusPriority[b.currentStatus];
                    }

                    // For WAITING patients: EMERGENCY first
                    if (a.currentStatus === CurrentStatusType.WAITING && b.currentStatus === CurrentStatusType.WAITING) {
                        if (a.queueType !== b.queueType) {
                            return a.queueType === QueueType.EMERGENCY ? -1 : 1;
                        }
                    }

                    // Finally, sort by arrivalTime (when they joined the queue)
                    return a.arrivalTime.getTime() - b.arrivalTime.getTime();
                });

                let baseTime = new Date(); // Start from current time
                let waitingProcessed = 0;

                for (const patient of sortedPatients) {
                    if (patient.currentStatus === CurrentStatusType.WITH_DOCTOR) {
                        // Active consultation: ends at updatedAt + AVG_TIME
                        const estimatedEnd = addMinutes(patient.updatedAt, AVG_CONSULTATION_MINUTES);
                        baseTime = estimatedEnd > baseTime ? estimatedEnd : baseTime;
                        result.push({ ...patient });
                    }
                    else if (patient.currentStatus === CurrentStatusType.DONE) {
                        // Completed: their slot ended at updatedAt + AVG_TIME
                        const estimatedEnd = addMinutes(patient.updatedAt, AVG_CONSULTATION_MINUTES);
                        baseTime = estimatedEnd > baseTime ? estimatedEnd : baseTime;
                        result.push({ ...patient });
                    }
                    else if (patient.currentStatus === CurrentStatusType.WAITING) {
                        // Calculate expected time based on current baseTime + position
                        const expectedTime = addMinutes(baseTime, waitingProcessed * AVG_CONSULTATION_MINUTES);
                        result.push({ ...patient, expectedTime });
                        waitingProcessed++;
                    }
                }
            }

            // Final global sort (across all doctors):
            // 1. WITH_DOCTOR first
            // 2. Then WAITING (emergencies first, then by expectedTime)
            // 3. Then DONE
            const finalSorted = result.sort((a, b) => {
                const statusPriority = {
                    [CurrentStatusType.WITH_DOCTOR]: 0,
                    [CurrentStatusType.WAITING]: 1,
                    [CurrentStatusType.DONE]: 2,
                };

                if (statusPriority[a.currentStatus] !== statusPriority[b.currentStatus]) {
                    return statusPriority[a.currentStatus] - statusPriority[b.currentStatus];
                }

                // For WAITING: EMERGENCY before NORMAL, then by expectedTime
                if (a.currentStatus === CurrentStatusType.WAITING) {
                    if (a.queueType !== b.queueType) {
                        return a.queueType === QueueType.EMERGENCY ? -1 : 1;
                    }
                    return (a.expectedTime?.getTime() ?? 0) - (b.expectedTime?.getTime() ?? 0);
                }

                // For others: sort by arrivalTime
                return a.arrivalTime.getTime() - b.arrivalTime.getTime();
            });

            ApiResponse.success(res, finalSorted, "Successfully fetched all the patient list in the queue for today.", HTTP_STATUS.OK);
            return;
        }

        // ... PAST logic unchanged
        const data = await QueueRepository.getPastListExcludingToday();
        if (!data) {
            throw new ApiError("Failed to get past patient list, please try again.");
        }
        ApiResponse.success(res, data, "Successfully fetched all the past patients list.", HTTP_STATUS.OK);
    }
    static async checkQueueExists(id: string) {
        const isExists = await QueueRepository.existById(id);
        if (!isExists) {
            throw new ApiError("No patient in queue exists with given id.");
        }
        return isExists;
    }

    static async deletePatientQueue(id: string, res: Response) {
        const data = ZUuid.safeParse({ id });
        if (!data.success) {
            throw new ApiError("Invalid ID passed.");
        }
        await this.checkQueueExists(id);

        const isDeleted = await QueueRepository.deleteById(id);

        if (!isDeleted) {
            throw new ApiError("Failed to removed the patient from the queue.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        ApiResponse.success(res, isDeleted, "Successfully removed patient from the queue.", HTTP_STATUS.OK);
    }

    static async editPatientQueue(id: string, editData: TPatientQueueEdit, res: Response) {
        const data = ZUuid.safeParse({ id });
        if (!data.success) {
            throw new ApiError("Invalid ID passed.");
        }

        const queueData = await this.checkQueueExists(id);

        if (editData.currentStatus === "WITH_DOCTOR" && queueData.doctorId) {
            const patientWithDoctor = await QueueRepository.getTodaysWithDoctorPatient(queueData.doctorId);
            console.log(patientWithDoctor);
            
            if (patientWithDoctor.length >= 1) {
                throw new ApiError("You can't assign this patient with doctor, as the doctor is busy with other patients.");
            }
        }
        const updatedData = await QueueRepository.updateById(id, editData);

        if (!updatedData) {
            throw new ApiError("Failed to updated the data.");
        }

        ApiResponse.success(res, updatedData, "Successfully updated the queue data.", HTTP_STATUS.OK);
    }

    static async getStats(res: Response) {
        const data = await QueueRepository.getTodaysStats();
        if (!data) {
            throw new ApiError("Failed to get queue stats for today.");
        }
        ApiResponse.success(res, data, "Successfully computed queue stats for today.", HTTP_STATUS.OK);
    }
}