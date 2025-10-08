import { Router } from "express";
import { authenticateUser } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { ZCreateAppointment, ZEditAppointment } from "../types/appointment.types";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppointmentController } from "../controllers/appointment.controller";

const router = Router();

router.route("/")
    .post(authenticateUser, validate(ZCreateAppointment), asyncHandler(AppointmentController.createAppointment))
    .get(authenticateUser, asyncHandler(AppointmentController.getAppointments));
router.route("/stats")
    .get(authenticateUser, asyncHandler(AppointmentController.getStats));
router.route("/:id")
    .patch(authenticateUser, validate(ZEditAppointment), asyncHandler(AppointmentController.updateAppointment))
    .delete(authenticateUser, asyncHandler(AppointmentController.deleteAppointment));
    
export default router;