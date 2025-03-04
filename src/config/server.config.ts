import { registerAs } from "@nestjs/config";

export const ServerConfigName = 'server';

export interface ServerConfig {
    nodeEnv: string;
    port: number;
}

export default registerAs(ServerConfigName, () => ({
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || '3000')
}));