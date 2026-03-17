import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import  { AuthGuard } from '../auth/guards/auth.guard';
import { JwtStrategy } from './jwt.stratergy';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '../rbac/entities/roles.entity';
import { Permission } from '../rbac/entities/permissions.entity';


@Module({
  imports: [UsersModule,
    PassportModule,
    ConfigModule.forRoot(),
    // SequelizeModule.forFeature([Role,RolePermission,Permission,UserRole]),
    // PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      //we need to tell authmodule how to create a token
      imports: [ConfigModule], //ConfigModule exports ConfigService which is then can be used here when importing ConfigModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }), //async bcz to wait for configmodule to read the env var first
    
    //Basic JWT Implementation No passport
    // JwtModule.register({
    //   global: true,
    //   secret: 'secret',
    //   signOptions: { expiresIn: '60s' },
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    JwtStrategy,
    // {
    // provide: APP_GUARD,
    // useClass: AuthGuard,
    // //Binds authGuard to all EndPoints and we must use a mechanism to declare routes as public
    // //Even the login route which is supposed to provide the token is locked behind authguard
    // },
  ],
})
export class AuthModule {}
