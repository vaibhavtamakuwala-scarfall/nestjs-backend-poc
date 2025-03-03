import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenPayload } from 'google-auth-library';
import { GoogleStrategy } from './google.strategy';
import { userDetailsToStore } from '../interfaces/auth-user.interface';
import { SigninMethods } from 'src/common/enum/auth.enum';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleService {
  constructor(private readonly googleStrategy: GoogleStrategy, private readonly authService: AuthService) { }

  async authenticationWithGoogle(idToken: string) {
    try {
      const extractedData: TokenPayload | undefined = await this.googleStrategy.verifyGoogleIdToken(idToken);
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
        authType: SigninMethods.GOOGLE,
        name: extractedData.name,
        email: extractedData.email,
        profileImg: extractedData.picture
      }
      const user = await this.authService.checkAndStoreUser(dataToProcess);
      console.log('user: ', user);
      // const token = await generateToken(user);
      return {
        email: user.email,
        // token
      }
    } catch (error) {
      console.error("Error - authenticationWithGoogle: ", error);
      throw new BadRequestException(error);
    }
  };
}
