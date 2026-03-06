import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import bcrypt from 'bcryptjs';
import { hash } from 'crypto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
    ){}

    private passwordHash(password: string): string {
        const salt = bcrypt.genSaltSync(10);
        return hash(password,salt);
    }

    signup(createUserDto: CreateUserDto): Promise<User>{
        // const username = createUserDto.username;
        // const email = createUserDto.email;
        // const password = createUserDto.password;

        if(this.userService.isExistingUser(createUserDto)){
            //email already exists
            throw new ConflictException("Email Already Exists");
        }
        if(this.userService.isUsernameTaken(createUserDto)){
            throw new ConflictException("Username Taken");
        }
        const passwordHash = this.passwordHash(createUserDto.password);
        return this.userService.create({
            username: createUserDto.username,
            email: createUserDto.email,
            password: passwordHash,
        })
    }

    async login(identifier: string, password: string) {
        //identifier can be email or username with password 
        //send both identifier and hash this password so that it matches the hash in db
        const user = await this.userService.findUser(identifier);
        const hashedPassword = user.password;
        if(bcrypt.compare(password, hashedPassword) || password === hashedPassword){
            return user;
        }else{
            throw new UnauthorizedException("Invalid credentials");
        }
    }

}
