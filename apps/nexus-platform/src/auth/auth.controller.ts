import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateLoginDto } from './dto/create-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from '../interfaces/express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
  ) {}

  // @Public()
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto){
    return this.authService.signup(createUserDto);
  }

  // @Public()
  @Post('login')
  login(@Body() loginDto: CreateLoginDto){
    return this.authService.login(loginDto.identifier, loginDto.password);
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken: string }) {
    // we need the userId.
    // BUT the access token is expired, so req.user might be empty/invalid.
    // WE MUST DECODE THE REFRESH TOKEN MANUALLY here or in Service.
    
    return this.authService.refreshTokens(body.refreshToken);
  }
  
  @UseGuards(AuthGuard('jwt')) // Ensure a valid access token is present
  @Post('logout')
  async logout(@Request() req: AuthRequest) {
    // Assuming req.user is populated by the JwtGuard/Strategy
    await this.authService.logout(req.user.userId); // Method to clear the token in DB
    return { message: 'Logout successful' };
  }

}
