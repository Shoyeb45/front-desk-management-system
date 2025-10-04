import { Request, Response } from "express";
import { AuthService } from "../service/auth.service";

export class AuthController {
    static async login(req: Request, res: Response) {
        const body = req.body;
        await AuthService.login(body, res);
    }
}