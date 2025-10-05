import { prisma } from "../../database/prisma";
import { TUserCreate } from "../types/user.type";

export class UserRepository {
    static async create(data: TUserCreate) {
        return await prisma.user.create({
            data,
            select: {
                id: true, name: true, role: true, email: true
            }
        });
    }

    static async getUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email }
        })
    }

    static async getUsers(where: {
        role?: "ADMIN" | "STAFF" | undefined
    }) {
        return await prisma.user.findMany({
            where
        });
    }
}