import { Injectable } from '@nestjs/common';
import { verify, sign, decode, JwtPayload, DecodeOptions, VerifyOptions } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { ServerConfigName } from 'src/config/server.config';

type ExpiresInType = `${number}${"y" | "d" | "h" | "m" | "s" | "ms"}`;
export type JwtResponseType = null | JwtPayload | string;

@Injectable()
export class JwtHelper {
    private readonly jwtSecret: string;

    constructor(private readonly configService: ConfigService) {
        this.jwtSecret = this.configService.getOrThrow<string>(`${ServerConfigName}.jwtSecret`);
    }

    /**
     * Sign a new JWT token
     * @param payload - Data to encode
     * @returns JWT Token
     */
    signToken(payload: object, jwtExpiresIn: ExpiresInType): string {
        return sign(payload, this.jwtSecret, { expiresIn: jwtExpiresIn });
    }

    /**
     * Verify a JWT token
     * @param token - JWT token
     * @returns Decoded payload or null if invalid
     */
    verifyToken(token: string, secret: string = this.jwtSecret, options?: VerifyOptions): JwtResponseType {
        return verify(token, secret, options);
    }

    /**
     * Decode a JWT token without verifying
     * @param token - JWT token
     * @returns Decoded payload
     */
    decodeToken(token: string, options?: DecodeOptions): JwtResponseType {
        return decode(token, options);
    }
};
