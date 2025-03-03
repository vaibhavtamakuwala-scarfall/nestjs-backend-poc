import { SigninMethods } from "src/common/enum/auth.enum";

export interface userDetailsToStore {
    providerId: string,
    name?: string,
    email?: string | undefined,
    authType: SigninMethods,
    profileImg?: string
};