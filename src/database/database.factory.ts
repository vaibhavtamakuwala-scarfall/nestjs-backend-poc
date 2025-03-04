import { Injectable, Logger } from '@nestjs/common';
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig, DbConfigName } from '../config/database.config';
import mongoose, { Connection } from 'mongoose';
import { ServerConfig, ServerConfigName } from '../config/server.config';

@Injectable()
export class DatabaseFactory implements MongooseOptionsFactory {
    constructor(private readonly configService: ConfigService) { }

    createMongooseOptions(): MongooseModuleOptions {
        const dbConfig = this.configService.getOrThrow<DatabaseConfig>(DbConfigName);
        const serverConfig = this.configService.getOrThrow<ServerConfig>(ServerConfigName);

        // Construct MongoDB URI dynamically
        const credentials = dbConfig.user && dbConfig.password
            ? `${encodeURIComponent(dbConfig.user)}:${encodeURIComponent(dbConfig.password)}@`
            : '';

        const dbPort = dbConfig.port ? `:${dbConfig.port}` : '';
        const replicaSet = dbConfig.replicaSet ? `?replicaSet=${dbConfig.replicaSet}` : '';

        const dbURI = `${dbConfig.connType}://${credentials}${dbConfig.host}${dbPort}/${dbConfig.name}${replicaSet}`;

        // Enable debug mode in development
        if (serverConfig.nodeEnv === 'development') {
            mongoose.set('debug', true);
        }

        Logger.log(`Database URI: ${dbURI}`, 'DatabaseFactory');

        return {
            uri: dbURI,
            connectionFactory: (connection: Connection) => {
                this.setupEventListeners(connection);
                return connection;
            },
            autoIndex: true,
            minPoolSize: dbConfig.minPoolSize,
            maxPoolSize: dbConfig.maxPoolSize,
            connectTimeoutMS: 60000, // 60s timeout
            socketTimeoutMS: 45000,  // 45s inactivity timeout
        };
    }

    /**
     * Adds event listeners for monitoring MongoDB connection status
     */
    private setupEventListeners(connection: Connection) {
        connection.on('connected', () => Logger.log('✅ Database Connected', 'Database'));
        connection.on('open', () => Logger.log('🔓 Database Connection Open', 'Database'));
        connection.on('disconnected', () => Logger.warn('❌ Database Disconnected', 'Database'));
        connection.on('reconnected', () => Logger.log('🔄 Database Reconnected', 'Database'));
        connection.on('disconnecting', () => Logger.warn('⚠️ Database Disconnecting', 'Database'));
        connection.on('error', (error) => Logger.error(`❗ Database Error: ${error.message}`, 'Database'));
    }
}