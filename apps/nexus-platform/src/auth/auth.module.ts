import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.stratergy';
import { TokenFactory } from './factories/token.factory';
import { RbacModule } from '../rbac/rbac.module';


@Module({
  imports: [UsersModule,
    RbacModule,
    PassportModule,
    ConfigModule.forRoot(),
    // SequelizeModule.forFeature([Role,RolePermission,Permission,UserRole]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({}), // Empty! Just give us the service.

    //We're providing these configurations using the token factory now so we jsut register for the service here
    // JwtModule.registerAsync({
    //   //we need to tell authmodule how to create a token
    //   imports: [ConfigModule], //ConfigModule exports ConfigService which is then can be used here when importing ConfigModule
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: 'secret',
    //     signOptions: { expiresIn: '1h' },
    //   }),
    //   inject: [ConfigService],
    // }), //async bcz to wait for configmodule to read the env var first
    
    //Basic JWT Implementation No passport
    // JwtModule.register({
    //   global: true,
    //   secret: 'secret',
    //   signOptions: { expiresIn: '60s' },
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    TokenFactory,
    JwtStrategy,
    // {
    // provide: APP_GUARD,
    // useClass: AuthGuard,
    // //Binds authGuard to all EndPoints and we must use a mechanism to declare routes as public
    // //Even the login route which is supposed to provide the token is locked behind authguard
    // },
  ],
  exports: [PassportModule, JwtStrategy, TokenFactory]
})
export class AuthModule {}
