import { Router } from "express";
import userRouter from "./user.router";
import authRouter from "./auth.route";
import doctorRouter from "./doctor.route";
import doctorAvailabilityRouter from "./doctor-availability.routes";

export const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/doctor", doctorRouter);
router.use("/doctor-availability", doctorAvailabilityRouter);