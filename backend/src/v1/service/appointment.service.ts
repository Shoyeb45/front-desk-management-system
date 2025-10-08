import { Response } from "express";
import { TCreateAppointment, TEditAppointment } from "../types/appointment.types";
import { PatientRepository } from "../repositories/patient.repository";
import { logger } from "../../utils/logger";
import { ApiError } from "../../utils/ApiError";
import { AppointmentRepository } from "../repositories/appointment.repository";
import { removeKeys, verifyUUID } from "../../utils/helper";
import { ApiResponse } from "../../utils/ApiResponse";
import { HTTP_STATUS } from "../../utils/httpCodes";

export class AppointmentService {
    static async createAppointment(data: TCreateAppointment, res: Response) {
        let patient = await PatientRepository.getByEmail(data.patient.email);

        if (!patient) {
            logger.info("Patient doesn't existing creating new one.");
            patient = await PatientRepository.create(data.patient);
        } else {
            if (data.patient.isNewPatientNeeded) {
                logger.info("Staff request for new patient, creating new one.");
                patient = await PatientRepository.create(data.patient);
            } else {
                logger.info("Patient exists, updating with new data.");
                patient = await PatientRepository.update(patient.id, data.patient);
            }
        }

        if (!patient) {
            throw new ApiError("Failed to create appointment, please try once again.");
        }
        const appointment = await AppointmentRepository.create(removeKeys(data, ["patient"]) as Omit<TCreateAppointment, "patient">, patient.id);

        if (!appointment) {
            throw new ApiError("Failed to create appointment, please try once again.");
        }
        ApiResponse.success(res, appointment, "Successfully created appointment.", HTTP_STATUS.OK);
    }

    static async isAppointmentExists(id: string) {
        const data = await AppointmentRepository.isExists(id);
        if (!data) {
            throw new ApiError("No appointment exists with given id.");
        }
        return data;
    }
    static async updateAppointment(id: string, data: TEditAppointment, res: Response) {
        if (!verifyUUID(id)) {
            throw new ApiError("Invalid id provided.", HTTP_STATUS.BAD_REQUEST);
        }
        await this.isAppointmentExists(id);
        const updatedData = await AppointmentRepository.update(id, data);

        if (!updatedData) {
            throw new ApiError("Failed to update the appointment.")
        }
        ApiResponse.success(res, updatedData, "Successfully updated the appointment.", HTTP_STATUS.OK);
    }

    static async deleteAppointment(id: string, res: Response) {
        if (!verifyUUID(id)) {
            throw new ApiError("Invalid id provided.", HTTP_STATUS.BAD_REQUEST);
        }
        await this.isAppointmentExists(id);

        const deletedData = await AppointmentRepository.deleteById(id);
        if (!deletedData) {
            throw new ApiError("Failed to delete the appointment");
        }
        ApiResponse.success(res, deletedData, "Successfully deleted the appointment.", HTTP_STATUS.OK);
    }

    static async getAppointments(filter: string, res: Response) {
        if (!filter || (filter !== "TODAY" && filter !== "PAST")) {
            throw new ApiError("Invalid filter, please send TODAY or PAST.");
        }

        if (filter === "TODAY") {
            const data = await AppointmentRepository.getTodaysAppointments();
            if (!data) {
                throw new Error("Failed to get today's appointment list, please try again one more time.");
            }
            ApiResponse.success(res, data, "Successfully fetched all today's appointments list.");
        }
        
        const data = await AppointmentRepository.getPastAppointments();
        if (!data) {
            throw new Error("Failed to get past appointment list, please try again one more time.");
        }
        ApiResponse.success(res, data, "Successfully fetched all past appointments list.");
    }
}