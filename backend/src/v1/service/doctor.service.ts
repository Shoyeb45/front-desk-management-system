import { Response } from "express";
import { TCreateDoctor } from "../types/doctor.type";
import { DoctorRepository } from "../repositories/doctor.repository";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { HTTP_STATUS } from "../../utils/httpCodes";

export class DoctorService {
    static async createDoctor(doctorData: TCreateDoctor, res: Response) {
        const doc = await DoctorRepository.create(doctorData);
        if (!doc) {
            throw new ApiError("Failed to create new doctor");
        }
        ApiResponse.success(res, doc, "Doctor created Successfully", 201);
    }

    static async getDoctors(res: Response) {
        const doctors = await DoctorRepository.getAllDoctor();
        ApiResponse.success(res, { users: doctors }, "Successfully fetched all the doctors.", 201);
    }

    static async deleteDoctor(id: string, res: Response) {
        if (!id || id.trim() === "") {
            throw new ApiError("No id found to delete the doctor.")
        }
        const data = await DoctorRepository.deleteById(id);
        ApiResponse.success(res, data, "Deleted doctor successfully.", HTTP_STATUS.OK);
    }
}