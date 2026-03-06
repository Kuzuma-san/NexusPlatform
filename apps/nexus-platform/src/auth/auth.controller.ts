import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateLoginDto } from './dto/create-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
  ) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto){
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: CreateLoginDto){
    return this.authService.login(loginDto.identifier, loginDto.password);
  }

}
