//Implementing custom AuthGuard without stratergy for guarding endpoints and attaching payload to request
//To use: @UseGuard(AuthGuards) to implement authguard on an endpoint
//Note: Use our customAuthguard and not AuthGuard by Passport which implements a stratergy
//We'll use defualt passport AuthGuard with jwt stratergy for passport integration later
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import { Reflector } from '@nestjs/core';

//Similarly we can make a RolesGuard and @Roles decorator to check the role and if a role is Admin we can make it bypass certain things
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    //Implementing isPublic decorator to return true if an endpoint has public decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("User is Not Authorized");
    }
    try {
      // 💡 Here the JWT secret key that's used for verifying the payload 
      // is the key that was passsed in the JwtModule
      const payload = await this.jwtService.verifyAsync(token);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload; //attaching an object named user on request with payload options inside
    } catch {
      throw new UnauthorizedException("Error Verifying Token");
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];// Bearer token_anflfssssssssn
    return type === 'Bearer' ? token : undefined;
  }
}
