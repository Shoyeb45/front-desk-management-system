// server.ts
import express, { json, urlencoded } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import cors from "cors";
import { config } from "./config/app.config";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string,
        role: "ADMIN" | "STAFF"
      };
    }
  }
}



export const app = express();

app
  .use(json())
  .use(urlencoded())
  .use(helmet())
  .use(cookieParser())
  .get("/", (req, res) => {
    res.json({
      message: "Backend of Frontend desk management app is running",
      success: true,
    });
  })
  .use(
    cors({
      origin: config.frontendUrl,
      credentials: true,
    })
  )
  .get("/health", (req, res) => {
    res.json({
      message: "Backend of Frontend desk management is running and it's healthy",
      success: true,
    });
  })
  .get("/wake-up", (req, res) => {
    res.json({
      message: "This api was called to wake up the server",
      success: true
    })
  });



