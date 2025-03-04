import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabaseFactory } from './database.factory';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useClass: DatabaseFactory,
        }),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule { }
