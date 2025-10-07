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

    static async getQueueList(req: Request, res: Response) {
        const filter = req.query.filter as string;
        await PatientQueueService.getPatientQueueList(filter, res);
    }

    static async deletePatientFromTheQueue(req: Request, res: Response) {
        const id = req.params.id as string;
        await PatientQueueService.deletePatientQueue(id, res);
    }

    static async editPatientQueue(req: Request, res: Response) {
        const id = req.params.id as string;
        await PatientQueueService.editPatientQueue(id, req.body, res);
    }
}