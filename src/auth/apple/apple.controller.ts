import { Controller, Post, Body } from '@nestjs/common';
import { AppleService } from './apple.service';
import { SigninAppleDto } from './dto/signin-apple.dto';

@Controller('apple')
export class AppleController {
  constructor(private readonly appleService: AppleService) { }

  @Post("verify")
  signinWithApple(@Body() { idToken }: SigninAppleDto) {
    return this.appleService.authenticationWithApple(idToken);
  }
}
