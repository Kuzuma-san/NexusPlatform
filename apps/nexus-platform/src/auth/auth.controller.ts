import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateLoginDto } from './dto/create-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
  ) {}

  // @Public()
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto){
    console.log("Req hit the signup route");
    return this.authService.signup(createUserDto);
  }

  // @Public()
  @Post('login')
  login(@Body() loginDto: CreateLoginDto){
    console.log("Req hit the login route");
    return this.authService.login(loginDto.identifier, loginDto.password);
  }

}
