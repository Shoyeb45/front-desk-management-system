import { Request, Response } from "express";
import { UserService } from "../service/user.service";

export class UserController {
    static async createUser(req: Request, res: Response) {
        const data = req.body;
        await UserService.createUser(data, res); 
    }
}