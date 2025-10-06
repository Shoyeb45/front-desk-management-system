import { Router } from "express"
import { authenticateUser, roleRequired } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { ZCreateDoctor, ZEditDoctor } from "../types/doctor.type";
import { DoctorController } from "../controllers/doctor.controller";

const router = Router();

router.route("/")
    .post(authenticateUser, roleRequired("ADMIN"), validate(ZCreateDoctor), asyncHandler(DoctorController.createDoctor));

router.route("/")
    .get(authenticateUser, asyncHandler(DoctorController.getDoctors));
    
router.route("/:id")
    .delete(authenticateUser, roleRequired("ADMIN"), asyncHandler(DoctorController.deleteDoctor))
    .get(asyncHandler(DoctorController.getDoctor))
    .put(authenticateUser, roleRequired("ADMIN"), validate(ZEditDoctor), asyncHandler(DoctorController.editDoctor))

export default router;