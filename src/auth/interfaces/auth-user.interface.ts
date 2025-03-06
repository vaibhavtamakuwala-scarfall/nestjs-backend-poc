import { SigninMethods } from "src/common/enum/auth.enum";

export interface userDetailsToStore {
    providerId: string,
    name?: string,
    email?: string | undefined,
    authType: SigninMethods,
    profileImg?: string
};

export interface AppleSignInData {
    iss: 'https://appleid.apple.com',
    aud: string,
    exp: number,
    iat: number,
    sub: string,
    email: string,
    email_verified: boolean | "true" | "false",
    is_private_email: boolean | "true" | "false",
    nonce_supported: boolean
}