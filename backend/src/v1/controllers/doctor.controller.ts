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
        const id = req.params.id;
        await DoctorService.deleteDoctor(id, res);
    }
}