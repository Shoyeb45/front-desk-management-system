import { Request, Response } from "express";
import { AppointmentService } from "../service/appointment.service";

export class AppointmentController {
    static async createAppointment(req: Request, res: Response) {
        await AppointmentService.createAppointment(req.body, res);
    }
    static async updateAppointment(req: Request, res: Response) {
        const id = req.params.id as string;
        await AppointmentService.updateAppointment(id, req.body, res);
    }
    static async deleteAppointment(req: Request, res: Response) {
        const id = req.params.id as string;
        await AppointmentService.deleteAppointment(id, res);
    }

    static async getAppointments(req: Request, res: Response) {
        const filter = req.query.filter as string;
        await AppointmentService.getAppointments(filter, res);
    }

    static async getStats(req: Request, res: Response) {
        await AppointmentService.getStats(res);
    }
}