import { Response } from "express";
import { TCreateQueue, TCreateQueuePatient } from "../types/patient-queue.types";
import { ApiResponse } from "../../utils/ApiResponse";
import { PatientRepository } from "../repositories/patient.repository";
import { ApiError } from "../../utils/ApiError";
import { QueueRepository } from "../repositories/queue.repository";
import { HTTP_STATUS } from "../../utils/httpCodes";
import { logger } from "../../utils/logger";

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
}