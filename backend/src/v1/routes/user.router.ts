import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { ZUserCreate, ZUserEdit } from "../types/user.type";
import { asyncHandler } from "../../utils/asyncHandler";
import { UserController } from "../controllers/user.controller";
import { authenticateUser, roleRequired } from "../../middlewares/auth.middleware";

const router = Router();

// api to create user
router.route("/")
    .post(validate(ZUserCreate), asyncHandler(UserController.createUser));

router.route("/")
    .get(asyncHandler(UserController.getUsers));


router.route("/:id")
    .delete(authenticateUser, asyncHandler(UserController.deleteUser));

router.route("/:id")
    .put(authenticateUser, roleRequired("ADMIN"), validate(ZUserEdit), asyncHandler(UserController.editUser));

router.route("/:id")
    .get(authenticateUser, asyncHandler(UserController.getUser));
    
export default router;