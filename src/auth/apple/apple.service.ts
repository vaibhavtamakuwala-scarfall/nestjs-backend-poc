import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AppleStrategy } from './apple.strategy';
import { AppleSignInData, userDetailsToStore } from '../interfaces/auth-user.interface';
import { SigninMethods } from 'src/common/enum/auth.enum';

@Injectable()
export class AppleService {
  constructor(private readonly appleStrategy: AppleStrategy, private readonly authService: AuthService) { }

  async authenticationWithApple(idToken: string) {
    try {
      const extractedData = await this.appleStrategy.verifyAppleIdToken(idToken) as AppleSignInData;
      // Check if extractedData is undefined
      if (!extractedData) {
        throw new BadRequestException({
          message: "TEST"
          // message: ERROR_MESSAGES.AUTH.authVerifyFailed("Google ID"),
          // statusCode: responseConstant.RESPONSE_STATUS_CODE.validationError,
          // errorCode: "GOOGLE_TOKEN_ERROR"
        });
      }

      const dataToProcess: userDetailsToStore = {
        providerId: extractedData.sub,
        authType: SigninMethods.APPLE,
        email: (!extractedData.is_private_email || extractedData.is_private_email === "false") ? extractedData.email : undefined
      }
      const user = await this.authService.checkAndStoreUser(dataToProcess);
      console.log('user: ', user);
      // const token = await generateToken(user);
      return {
        email: user.email,
        // token
      }
    } catch (error) {
      console.error("Error - authenticationWithApple: ", error);
      throw new BadRequestException(error);
    }
  };
}
