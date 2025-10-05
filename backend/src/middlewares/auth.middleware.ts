import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";
import { config } from "../config/app.config";

interface DecodedUserPayload {
    id: string;
    role: "ADMIN" | "STAFF"
}


export const verifyJwt = (token: string): DecodedUserPayload => {
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as DecodedUserPayload;
        return decoded;
    } catch (error) {
        logger.error("Failed to verify jwt, error: " + error);
        throw new Error('Invalid or expired token');
    }
};


export function authenticateUser(req: Request, res: Response, next: NextFunction) {
    try {
        let token: string | undefined;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Unauthorized access, token is missing.",
                errors: [],
                timeStamp: new Date().toISOString(),
                path: req.originalUrl
            });
            return;
        }


        const payload = verifyJwt(token);

        if (!payload) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Unauthorized access, failed to verify the token.",
                errors: [],
                timeStamp: new Date().toISOString(),
                path: req.originalUrl
            });
            return;
        }

        req.user = {
            id: payload.id,
            role: payload.role
        };

        next();
    } catch (error) {
        logger.error("Failed to autheticate user, error: " + error);
        res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Failed to authenticate user",
            errors: [],
            timeStamp: new Date().toISOString(),
            path: req.originalUrl
        })
        return;
    }
}

export function roleRequired(role: "ADMIN" | "STAFF"): RequestHandler {
    return (req, res, next): void => {
        if (!req.user || !req.user.role) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Failed to authenticate user",
                errors: [],
                timeStamp: new Date().toISOString(),
                path: req.originalUrl
            });
            return;
        }
        
        if (req.user?.role !== role) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: "User is not allowed to perform the given task.",
                errors: [],
                timeStamp: new Date().toISOString(),
                path: req.originalUrl
            })
            return;
        }

        next();
    }
}