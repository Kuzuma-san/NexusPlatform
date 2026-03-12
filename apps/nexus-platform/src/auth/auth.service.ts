import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import bcrypt from 'bcrypt';
import { access } from 'fs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ){}

    private async passwordHash(password: string): Promise<string> {
        const salt = bcrypt.genSaltSync(10);
        return await bcrypt.hash(password,salt);
    }
    // signup to store create user in DB and login to assign a jwt token
    async signup(createUserDto: CreateUserDto){
        // const username = createUserDto.username;
        // const email = createUserDto.email;
        // const password = createUserDto.password;

        if(await this.userService.isExistingUser(createUserDto.email)){
            //email already exists
            throw new ConflictException("Email Already Exists");
        }
        if(await this.userService.isUsernameTaken(createUserDto)){
            throw new ConflictException("Username Taken");
        }
        const passwordHash = await this.passwordHash(createUserDto.password);
        const user = await this.userService.create({
            username: createUserDto.username,
            email: createUserDto.email,
            password: passwordHash,
            },
        );
        // const userData = user.get({ plain: true });
        // delete userData.password;
        // return userData;
        const { password, ...safeUser } = user.get({ plain: true });
        return safeUser;
    }

    async login(identifier: string, password: string) {
        //identifier can be email or username with password 
        //send both identifier and hash this password so that it matches the hash in db
        const user = await this.validateUser(identifier, password);
        const id = user.id;
        const email = user.email;
        const payload = {
            sub: user.id,
            email: user.email,//extra information you want available after authentication
        }
        return { access_token: this.jwtService.sign(payload) };
    }
    
    async validateUser(identifier: string, pass: string): Promise<any> {
        const user = await this.userService.findUser(identifier);
        if(!user){
            throw new NotFoundException("User Not Found");
        }
        const hashedPassword = user.password;
        if(!bcrypt.compare(pass, hashedPassword) || pass !== hashedPassword){
            throw new UnauthorizedException("Invalid credentials");
        }
        const { password, ...result} = user;
        return result;
    }
}
