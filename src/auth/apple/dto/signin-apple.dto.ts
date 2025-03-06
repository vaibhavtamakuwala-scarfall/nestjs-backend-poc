import { IsNotEmpty, IsString } from 'class-validator';

export class SigninAppleDto {
    @IsString()
    @IsNotEmpty()
    idToken: string;
}
