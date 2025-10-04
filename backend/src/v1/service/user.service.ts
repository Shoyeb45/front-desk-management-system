import { Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse";
import { hashPassword } from "../../utils/helper";
import { UserRepository } from "../repositories/user.repository";
import { TUserCreate } from "../types/user.type";

export class UserService {
    static async createUser(data: TUserCreate, res: Response) {
        // store hashed password
        data.password = await hashPassword(data.password);
        const user = await UserRepository.create(data);
        ApiResponse.success(res, user, "User created successfully", 201);
        return;
    }
}