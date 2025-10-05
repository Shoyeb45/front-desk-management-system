import { Response } from "express";
import { TCreateDoctor } from "../types/doctor.type";
import { DoctorRepository } from "../repositories/doctor.repository";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";

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
}