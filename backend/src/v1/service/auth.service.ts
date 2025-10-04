import { CookieOptions, Response } from "express";
import { TLogin } from "../types/auth.types";
import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../../utils/ApiError";
import { generateToken, verifyPassword } from "../../utils/helper";
import { cookieOptions } from "../../config/cookie.config";
import { ApiResponse } from "../../utils/ApiResponse";

export class AuthService {
    static async login(data: TLogin, res: Response) {
        const user = await UserRepository.getUserByEmail(data.email);
        if (!user) {
            throw new ApiError("No user found with given email", 404);
        }
        // match password
        const isMatch = await verifyPassword(data.password, user.password);
        if (!isMatch) {
            throw new ApiError("Password is incorrect");
        }

        const token = generateToken({ id: user.id, role: user.role });

        res.cookie("token", token, cookieOptions);

        // remove the token, if the cookies worked in production
        ApiResponse.success(res, { token }, "User logged in successfully.", 200);
        return;
    }
}