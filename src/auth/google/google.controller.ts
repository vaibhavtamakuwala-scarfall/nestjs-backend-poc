import { Controller, Post, Body } from '@nestjs/common';
import { GoogleService } from './google.service';
import { SigninGoogleDto } from './dto/signin-google.dto';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) { }

  @Post("verify")
  signinWithGoogle(@Body() { idToken }: SigninGoogleDto) {
    return this.googleService.authenticationWithGoogle(idToken);
  }
}
