import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthController } from "../controllers/auth.controller";
import { ZLogin } from "../types/auth.types";

const router = Router();


router.route("/login")
    .post(validate(ZLogin), asyncHandler(AuthController.login));


export default router;