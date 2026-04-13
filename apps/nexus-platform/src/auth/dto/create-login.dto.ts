import { IsString } from "class-validator";

export class CreateLoginDto{
    @IsString()
    identifier!: string;

    @IsString()
    password!: string;
}
// ! = “I promise this will exist at runtime”