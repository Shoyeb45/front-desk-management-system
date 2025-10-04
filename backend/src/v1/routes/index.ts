import { Router } from "express";
import userRouter from "./user.router";
import authRouter from "./auth.route";

export const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);