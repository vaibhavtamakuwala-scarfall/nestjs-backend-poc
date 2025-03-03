import { registerAs } from "@nestjs/config";

export const AuthConfigName = 'auth';

export interface AuthConfig {
    googleWebClient: string;
}

export default registerAs(AuthConfigName, () => ({
    googleWebClient: process.env.GOOGLE_WEB_CLIENT
}));