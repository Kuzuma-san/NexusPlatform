import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../interfaces/token.interface';
import { TokenFactory } from './factories/token.factory';
import { RbacService } from '../rbac/rbac.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly tokenFactory: TokenFactory,
        private readonly rbacService: RbacService,
        private readonly configService: ConfigService
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
        const userRoles = await this.rbacService.getUserRoles(user.id);
        const rolesIds = userRoles.map(ur => ur.roleId);
        const roles = await this.rbacService.getRoles(rolesIds);

        const payload: TokenPayload = {
            sub: user.id,
            email: user.email,//extra information you want available after authentication
            roles: roles?.map(role => role.name) || [],// array of role names the user have
        }
        // return { access_token: this.jwtService.sign(payload)};

        //generate tokens
        const tokens = await this.tokenFactory.getCombinedTokens(payload);

        //save refresh hash to db
        await this.userService.setCurrentRefreshToken(tokens.refreshToken, user.id);

        return tokens;
    }
    
    async validateUser(identifier: string, pass: string) {
        const user = await this.userService.findUser(identifier);

        if (!user) {
            throw new NotFoundException("User Not Found");
        }

        const userData = user.get({ plain: true });

        const isMatch = await bcrypt.compare(pass, userData.password);
        if (!isMatch) {//&& pass!==userData.password
            throw new UnauthorizedException("Invalid credentials");
        }

        const { password, ...result } = userData;
        return result;
    }

    async refreshTokens(token: string){
        const payload = await this.jwtService.verifyAsync(token, {
            secret: this.configService.get('JWT_REFRESH_SECRET')
        });
        const {sub} = payload;
        
        const user = await this.userService.findOne(sub);

        //Also handle the edge case where currentHashedRefreshToken is null (logged out user):
        if(!user.currentHashedRefreshToken) throw new UnauthorizedException("No active session");

        //check if the refresh token for the user is the one stored in db cuz can be of some other user's or old token
        const isValid = await bcrypt.compare(token, user.currentHashedRefreshToken);
        if(!isValid) throw new UnauthorizedException("Unauthorized Token");

        const {iat,exp, ...cleanPayload} = payload;
        const tokens = await this.tokenFactory.getCombinedTokens(cleanPayload);
        await this.userService.setCurrentRefreshToken(tokens.refreshToken, sub);

        return tokens;
    } 

    async logout(userId: number) {
        // const user = await this.userService.findOne(userId);
        return this.userService.removeRefreshToken(userId);
    }
}
// client sends accesstoken -> server sends 401 token expired -> client sends refresh token -> if not valid logout -> if valid new access and refresh token and send back to client
