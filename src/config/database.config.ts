import { registerAs } from "@nestjs/config";

export const DbConfigName = 'database';

export interface DatabaseConfig {
    connType: string,
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    replicaSet: string,
    minPoolSize: number;
    maxPoolSize: number;
}

export default registerAs(DbConfigName, () => ({
    connType: process.env.DB_CONNECTION || 'mongodb',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 27017,
    name: process.env.DB_DATABASE || 'test',
    user: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    minPoolSize: process.env.DB_MIN_POOL_SIZE ? Number(process.env.DB_MIN_POOL_SIZE) : 5,
    maxPoolSize: process.env.DB_MAX_POOL_SIZE ? Number(process.env.DB_MAX_POOL_SIZE) : 20,
    replicaSet: process.env.DB_REPLICASET || '',
}));
