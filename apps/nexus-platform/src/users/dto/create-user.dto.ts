import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(3, { message: 'Username must be at least 3 characters' })
    @MaxLength(30, { message: 'Username cannot exceed 30 characters' })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
    username!: string;

    @IsEmail()
    @IsEmail({}, { message: 'Invalid email format' })
    email!: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @MaxLength(120)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/ , {
        message: 'Password must contain uppercase, lowercase, number, and special character'
    })
    password!: string;
}
/*
(?=.*[a-z]) — must contain at least one lowercase letter
(?=.*[A-Z]) — must contain at least one uppercase letter
(?=.*\d) — must contain at least one digit
(?=.*[\W_]) — must contain at least one special character (!@#$ etc.)
.{8,} — minimum 8 characters total
 */
