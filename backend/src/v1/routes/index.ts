import { Router } from "express";
import userRouter from "./user.router";
import authRouter from "./auth.route";
import doctorRouter from "./doctor.route";
import doctorAvailabilityRouter from "./doctor-availability.routes";
import patientQueueRouter from "./patient-queue.route";

export const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/doctor", doctorRouter);
router.use("/doctor-availability", doctorAvailabilityRouter);
router.use("/patient-queue", patientQueueRouter);