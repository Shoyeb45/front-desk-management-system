import { Request, Response } from "express";
import { DoctorService } from "../service/doctor.service";

export class DoctorController {
    static async createDoctor(req: Request, res: Response) {
        const body = req.body;
        await DoctorService.createDoctor(body, res);
    }


    static async getDoctors(req: Request, res: Response) {
        await DoctorService.getDoctors(res);
    }

    static async deleteDoctor(req: Request, res: Response) {
        const id = req.params.id as string;
        await DoctorService.deleteDoctor(id, res);
    }

    static async getDoctor(req: Request, res: Response) {
        const id = req.params.id as string;
        await DoctorService.getDoctor(id, res);
    }

    static async editDoctor(req: Request, res: Response) {
        const id = req.params.id as string;
        await DoctorService.editDoctor(id, req.body, res);
    }

    static async getAvailableDoctors(req: Request, res: Response) {
        const time = req.query.time as string;
        await DoctorService.getAvailableDoctors(time, res);
    }
}