import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleModule } from './google/google.module';
import { UserModule } from 'src/user/user.module';
import { AppleModule } from './apple/apple.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UserModule, GoogleModule, AppleModule],
})
export class AuthModule {}
