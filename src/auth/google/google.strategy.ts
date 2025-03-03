import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { AuthConfig, AuthConfigName } from '../../config/auth.config';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class GoogleStrategy {
  private readonly client: OAuth2Client;
  private readonly authconfig: AuthConfig;

  constructor(private readonly configService: ConfigService) {
    this.authconfig = this.configService.getOrThrow(AuthConfigName)
    if (!this.authconfig.googleWebClient) {
      throw new Error('Missing GOOGLE_WEB_CLIENT in environment variables');
    }

    this.client = new OAuth2Client(this.authconfig.googleWebClient);
  }

  // Verify Google ID token
  async verifyGoogleIdToken(idToken: string): Promise<TokenPayload | undefined> {

    console.log('this.authconfig: ', this.authconfig);
    try {
      // Initialize Google OAuth client
      const decodedToken = await this.client.verifyIdToken({
        idToken: idToken,
        audience: this.authconfig.googleWebClient,
      });
      return decodedToken.getPayload();
    } catch (error) {
      console.error("Error - verifyGoogleIdToken:", error);
      throw new BadRequestException(error);
    }
  };
}
