import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config";
import { UserModule } from './user/user.module';
import serverConfig from './config/server.config';
import authConfig from './config/auth.config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [serverConfig, authConfig],
  }), AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
