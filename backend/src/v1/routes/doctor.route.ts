import { Router } from "express"
import { authenticateUser, roleRequired } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { ZCreateDoctor } from "../types/doctor.type";
import { DoctorController } from "../controllers/doctor.controller";

const router = Router();

router.route("/")
    .post(authenticateUser, roleRequired("ADMIN"), validate(ZCreateDoctor), asyncHandler(DoctorController.createDoctor));

router.route("/")
    .get(authenticateUser, roleRequired("ADMIN"), asyncHandler(DoctorController.getDoctors));
    
export default router;