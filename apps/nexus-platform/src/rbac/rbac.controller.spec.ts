import { Test, TestingModule } from '@nestjs/testing';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './entities/roles.entity';
import { Permission } from './entities/permissions.entity';
import { UserRole } from './entities/user-role.entity';
import { RolePermission } from './entities/role-permission.entity';

describe('RbacController', () => {
  let controller: RbacController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SequelizeModule.forFeature([Role, Permission, UserRole, RolePermission])],
      controllers: [RbacController],
      providers: [RbacService],
    }).compile();

    controller = module.get<RbacController>(RbacController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
