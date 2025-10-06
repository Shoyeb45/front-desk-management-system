import { Request, Response } from "express";
import { DoctorAvailabilityService } from "../service/doctor-availability.service";

export class DoctorAvailabilityController {
    static async createAvailability(req: Request, res: Response) {
        await DoctorAvailabilityService.createDoctorAvailability(req.body, res);
    }

    static async getDoctorAvailability(req: Request, res: Response) {
        const doctorId = req.params.doctorId as string;
        await DoctorAvailabilityService.getDoctorAvailability(doctorId, res);
    }

    static async updateAvailability(req: Request, res: Response) {
        const slotId = req.params.slotId as string;
        await DoctorAvailabilityService.updateAvailability(slotId, req.body, res);
    }

    static async deleteAvailability(req: Request, res: Response) {
        const slotId = req.params.slotId as string;
        await DoctorAvailabilityService.deleteAvailability(slotId, res);
    }

    static async replaceAvailability(req: Request, res: Response) {
        await DoctorAvailabilityService.replaceAvailability(req.body, res);
    }
}