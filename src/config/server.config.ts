import { registerAs } from "@nestjs/config";

export const ServerConfigName = 'server';

export interface ServerConfig {
    nodeEnv: string;
    port: number;
    jwtSecret: string;
    accessTokenExpIn: string;
    refreshTokenExpIn: string;
}

export default registerAs(ServerConfigName, (): ServerConfig => ({
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || '3000'),
    jwtSecret: process.env.JWT_SECRET!,
    accessTokenExpIn: process.env.ACCESSTOKEN_EXPIRES_IN!,
    refreshTokenExpIn: process.env.REFRESHTOKEN_EXPIRES_IN!
}));