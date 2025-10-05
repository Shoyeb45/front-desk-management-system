import { Request, Response } from "express";
import { UserService } from "../service/user.service";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";

export class UserController {
    static async createUser(req: Request, res: Response) {
        const data = req.body;
        await UserService.createUser(data, res); 
    }

    static async getUsers(req: Request, res: Response) {
        const role = req.query.role as  "ADMIN"|"STAFF"| undefined;
        
        await UserService.getUsers(role, res)
    }
}