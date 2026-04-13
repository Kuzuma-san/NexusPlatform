import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokenFactory } from './factories/token.factory';
import { RbacModule } from '../rbac/rbac.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        RbacModule,
        PassportModule,
        ConfigModule.forRoot(),
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({}),
      ],
      providers: [AuthService, TokenFactory],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
