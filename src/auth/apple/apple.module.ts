import { Module } from '@nestjs/common';
import { AppleService } from './apple.service';
import { AppleController } from './apple.controller';
import { AppleStrategy } from './apple.strategy';
import { AuthService } from '../auth.service';
import { JwtHelper } from 'src/common/helpers/jwt.helper';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AppleController],
  providers: [AppleService, JwtHelper, AppleStrategy, AuthService],
  imports: [UserModule]
})
export class AppleModule { }
