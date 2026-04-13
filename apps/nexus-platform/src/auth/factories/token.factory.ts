import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthTokens, TokenPayload } from "../../interfaces/token.interface";
import { TimeManager } from "../../common/utils/time-manager";

@Injectable()
export class TokenFactory {
    constructor (
        private jwtService: JwtService,
        private configService: ConfigService
    ){}

    async getAccessToken(payload: any){
        // payload has the strucure of sub:number(userId) , email: string
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: '15m',
        });
    }

    async getRefreshToken(payload: any){
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });
    }

    async getCombinedTokens(payload: TokenPayload): Promise<AuthTokens>{
        const accessToken = await this.getAccessToken(payload);
        const refreshToken = await this.getRefreshToken(payload);
        const expiry = this.configService.get('JWT_ACCESS_TOKEN_EXPIRY');//15 min
        const expiresAt = TimeManager.fromNow(expiry).getTime();
        //we made the accesstoken expire in 15min so we also send the time so that the frontend knows when to refresh the token

        return {
            accessToken,
            refreshToken,
            expiresAt
        }
    }

    async verifyRefreshToken(token: string){
        try {
            // 1. Verify the Signature & Expiration using the REFRESH Secret
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            
            // 2. Return the decoded data
            return payload; // { sub: 1, email: ... }
        } catch (error) {
            throw new UnauthorizedException('Invalid Refresh Token');
        }
    }
}