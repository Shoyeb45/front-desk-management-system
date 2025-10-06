import { Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse";
import { hashPassword, removeKeys } from "../../utils/helper";
import { UserRepository } from "../repositories/user.repository";
import { TUserCreate, TUserEdit } from "../types/user.type";
import { ApiError } from "../../utils/ApiError";
import { HTTP_STATUS } from "../../utils/httpCodes";

export class UserService {
    static async createUser(data: TUserCreate, res: Response) {
        // store hashed password
        data.password = await hashPassword(data.password);
        const user = await UserRepository.create(data);
        ApiResponse.success(res, user, "User created successfully", 201);
        return;
    }


    static async getUsers(role: "ADMIN" | "STAFF" | undefined, res: Response) {
        if (role && (role != "STAFF" && role != "ADMIN")) {
            throw new ApiError("Only STAFF and ADMIN are valid role.");
        }

        const data = await UserRepository.getUsers({ role: role });
        ApiResponse.success(res, { users: data.map((d) => ({ id: d.id, email: d.email, name: d.name, role: d.role })) }, "Successfully fetched users.");
    }


    static async deleteUser(id: string, res: Response) {
        if (!id || !id.trim()) {
            throw new ApiError("No id found to delete the user.");
        }
        const data = await UserRepository.deleteById(id);
        ApiResponse.success(res, {
            name: data.name,
            id: data.id,
            email: data.email
        }, "Successfully deleted user.")
    }

    static async getUser(id: string, res: Response) {
        if (!id || !id.trim()) {
            throw new ApiError("No id found to delete the user.");
        }
        const data = await UserRepository.getUserById(id);

        if (!data) {
            throw new ApiError("No user found with given id");
        }

        ApiResponse.success(res, {
            id: data.id,
            name: data.name,
            email: data.email,
            gender: data.gender
        }, "Successfully fetched user detail", HTTP_STATUS.OK);
    }

    static async editUser(id: string, data: TUserEdit, res: Response) {
        if (!id || !id.trim()) {
            throw new ApiError("No id found to edit the user.")
        }

        const user = await UserRepository.editUserById(id, data);
        if (!user) {
            throw new ApiError("Failed to edit the user.")
        }
        ApiResponse.success(res, removeKeys(user, ["createdAt", "updatedAt", "password"]), "Successfully updated user.", 200);
    }
}