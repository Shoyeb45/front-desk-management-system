import { Router } from "express";
import { authenticateUser, roleRequired } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { ZCreateQueuePatient } from "../types/patient-queue.types";
import { asyncHandler } from "../../utils/asyncHandler";
import { PatientQueueController } from "../controllers/patient-queue.controller";

const router = Router();

router.route("/")
    .post(authenticateUser, roleRequired("STAFF"), validate(ZCreateQueuePatient), asyncHandler(PatientQueueController.createQueue))
    .get( asyncHandler(PatientQueueController.getQueueList));

router.route("/patient")
    .get(authenticateUser, asyncHandler(PatientQueueController.getPatient));

export default router;
