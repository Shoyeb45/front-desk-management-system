import { Router } from "express";
import { authenticateUser } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { ZCreateAvailabilitySlot, ZCreateDoctorAvailability, ZUpdateAvailabilitySlot } from "../types/doctor-availability.types";
import { asyncHandler } from "../../utils/asyncHandler";
import { DoctorAvailabilityController } from "../controllers/doctor-availability.controller";

const router = Router();

router.route("/")
    .post(authenticateUser, validate(ZCreateDoctorAvailability), asyncHandler(DoctorAvailabilityController.createAvailability));

router.route("/doctor/:doctorId")
    .get(authenticateUser, asyncHandler(DoctorAvailabilityController.getDoctorAvailability));

router.route("/:slotId")
    .patch(authenticateUser, validate(ZUpdateAvailabilitySlot), asyncHandler(DoctorAvailabilityController.updateAvailability));

router.route("/:slotId")
    .delete(authenticateUser, asyncHandler(DoctorAvailabilityController.deleteAvailability));

router.route("/replace")
    .put(authenticateUser, validate(ZCreateDoctorAvailability), asyncHandler(DoctorAvailabilityController.replaceAvailability))
export default router;