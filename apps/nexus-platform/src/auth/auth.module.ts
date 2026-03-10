import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import  { AuthGuard } from './auth.guard'


@Module({
  imports: [UsersModule,
    ConfigModule.forRoot(),
    // PassportModule.register({defaultStrategy: 'jwt'}),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       secret: config.get('JWT_SECRET'),
    //       signOptions: {
    //         expiresIn: config.get('JWT_EXPIRES'),
    //       }
    //     }
    //   }
    // }),
    
    //Basic JWT Implementation No passport
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    {
    provide: APP_GUARD,
    useClass: AuthGuard,
    //Binds authGuard to all EndPoints and we must use a mechanism to declare routes as public
    //Even the login route which is supposed to provide the token is locked behind authguard
    },
  ],
})
export class AuthModule {}
