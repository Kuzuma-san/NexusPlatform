import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
 
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),//in custom authguard we manually extracted the token but here we use the function
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), //the secret must match the secret used to sign the token
    });
  }
  //If token is valid, this runs.
  async validate(payload: any) {
    // payload is the JSON object we signed earlier { sub: 1, email: ... }
    // Whatever we return here gets attached to Request object as req.user
    return { userId: payload.sub, email: payload.email };//, role: payload.role
  }
} //what does this return do? :
//Whatever we return here becomes req.user...So later req.user={userId: 1, email:"abc"}