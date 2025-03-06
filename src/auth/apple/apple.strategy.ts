import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwksClient from 'jwks-rsa';
import { Agent } from 'https';
import { JwtHelper, JwtResponseType } from 'src/common/helpers/jwt.helper';


@Injectable()
export class AppleStrategy {

  private static readonly sharedAgent = new Agent({
    keepAlive: true,           // Reuse connections to avoid extra TLS handshakes
    keepAliveMsecs: 60000,    // Keep connections alive for 60s
    maxSockets: 150,         // Allow up to 150 concurrent requests
    maxFreeSockets: 50,     // Keep 50 idle sockets for reuse
    timeout: 5000,         // Close slow requests after 5 seconds
  });

  private static readonly client = jwksClient({
    jwksUri: 'https://appleid.apple.com/auth/keys',
    cache: true,                              // Cache Apple's keys for performance (keys refresh every 6 hours)
    cacheMaxAge: 6 * 60 * 60 * 1000,          // Cache for 6 hours
    rateLimit: true,                          // Prevent excessive network requests
    requestAgent: AppleStrategy.sharedAgent,  // Use shared connection agent
  });

  constructor(private readonly jwtHelper: JwtHelper) { }

  // Verify Apple ID Token
  async verifyAppleIdToken(idToken: string): Promise<JwtResponseType> {
    try {
      // Decode header to get the 'kid' (Key ID)
      const decoded: any = this.jwtHelper.decodeToken(idToken, { complete: true });
      if (!decoded) throw new Error('Invalid Apple ID Token');

      const key = await AppleStrategy.client.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();
      const currentTime = Math.floor(Date.now() / 1000);

      // Validate expire time.
      if (decoded.payload.exp < currentTime) {
        throw new Error('Token has expired');
      }

      // TODO: Add `nonce` check after implementing on frontend: Link: https://developer.apple.com/documentation/sign_in_with_apple/authenticating-users-with-sign-in-with-apple

      // Verify JWT using Apple's public key
      return this.jwtHelper.verifyToken(idToken, publicKey, { algorithms: ['RS256'] });
    } catch (error) {
      console.error("Error - verifyAppleIdToken: ", error);
      throw new BadRequestException(error);
    }
  }
}
