import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { GoogleStrategy } from './google.strategy';
import { AuthService } from '../auth.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy, AuthService],
  imports: [UserModule]
})
export class GoogleModule { }
