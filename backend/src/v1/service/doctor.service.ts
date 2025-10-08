import { Response } from "express";
import { TCreateDoctor, TEditDoctor, ZAvailableDoctors } from "../types/doctor.type";
import { DoctorRepository } from "../repositories/doctor.repository";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { HTTP_STATUS } from "../../utils/httpCodes";
import z from "zod";

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
    
    static async getDoctor(id: string, res: Response) {
        if (!id || id.trim() === "") {
            throw new ApiError("No id found to get the doctor.")
        }
        const data = await DoctorRepository.getDoctorById(id);
        
        ApiResponse.success(res, data, "Successfully fetched the data of the doctor.", HTTP_STATUS.OK);
    }
    
    static async editDoctor(id: string, data: TEditDoctor, res: Response) {
        if (!id || id.trim() === "") {
            throw new ApiError("No id found to get the doctor.")
        }

        const updatedData = await DoctorRepository.edit(id, data); 
        if (!updatedData) {
            throw new ApiError("Failed to update the doctor.");
        }
        ApiResponse.success(res, updatedData, "Successfully updated doctor.", HTTP_STATUS.OK);
    }

    static async getAvailableDoctors(time: string, res: Response) {
        const data = ZAvailableDoctors.safeParse({ time });

        if (!data.success) {
            throw new ApiError("The time is not in correct format, it should be in HH:MM.", HTTP_STATUS.BAD_REQUEST);
        }
        
        const availableDoctors = await DoctorRepository.getAvailableDoctorsForTime(new Date(), time);
        if (!availableDoctors) {
            throw new ApiError("Failed to get all the available doctors.");
        }
        ApiResponse.success(res, availableDoctors, "Successfully fetched all the available doctors.", HTTP_STATUS.OK);
    }
}