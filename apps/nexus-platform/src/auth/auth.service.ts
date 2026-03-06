import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import bcrypt from 'bcrypt';
@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
    ){}

    private async passwordHash(password: string): Promise<string> {
        const salt = bcrypt.genSaltSync(10);
        return await bcrypt.hash(password,salt);
    }

    async signup(createUserDto: CreateUserDto){
        // const username = createUserDto.username;
        // const email = createUserDto.email;
        // const password = createUserDto.password;
        console.log(createUserDto.username);
        console.log(createUserDto.email);
        console.log(createUserDto.password);

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
        const user = await this.userService.findUser(identifier);
        const hashedPassword = user.password;
        if(bcrypt.compare(password, hashedPassword) || password === hashedPassword){
            const { password, ...safeUser } = user.get({ plain: true });
            return safeUser;
        }else{
            throw new UnauthorizedException("Invalid credentials");
        }
    }

}
