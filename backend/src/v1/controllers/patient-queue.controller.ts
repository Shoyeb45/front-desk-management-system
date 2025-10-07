import { Request, Response } from "express";
import { PatientQueueService } from "../service/patient-queue.services";

export class PatientQueueController {
    static async createQueue(req: Request, res: Response) {
        await PatientQueueService.createQueue(req.body, res);
    }

    static async getPatient(req: Request, res: Response) {
        const email = req.query.email as string;
        await PatientQueueService.getPatient(email, res);   
    }
}