import { IsNotEmpty, IsString } from 'class-validator';

export class SigninGoogleDto {
    @IsString()
    @IsNotEmpty()
    idToken: string;
}
