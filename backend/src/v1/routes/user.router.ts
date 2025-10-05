import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { ZUserCreate } from "../types/user.type";
import { asyncHandler } from "../../utils/asyncHandler";
import { UserController } from "../controllers/user.controller";

const router = Router();

// api to create user
router.route("/")
    .post(validate(ZUserCreate), asyncHandler(UserController.createUser));

router.route("/")
    .get(asyncHandler(UserController.getUsers));
    
export default router;