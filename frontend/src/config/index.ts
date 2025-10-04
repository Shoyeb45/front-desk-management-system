export const appConfig = {
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
    nodeEnv: process.env.NODE_ENV || "development"
};