import { Request, Response } from "express";
import { UserService } from "../service/user.service";

export class UserController {
    static async createUser(req: Request, res: Response) {
        const data = req.body;
        await UserService.createUser(data, res); 
    }

    static async getUsers(req: Request, res: Response) {
        const role = req.query.role as  "ADMIN"|"STAFF"| undefined;
        
        await UserService.getUsers(role, res)
    }

    static async deleteUser(req: Request, res: Response) {
        const id = req.params.id;
        await UserService.deleteUser(id, res);
    }

    static async getUser(req: Request, res: Response) {
        const id = req.params.id as string;
        await UserService.getUser(id, res);
    }

    static async editUser(req: Request, res: Response) {
        const id = req.params.id as string;
        await UserService.editUser(id, req.body, res);
    }
}