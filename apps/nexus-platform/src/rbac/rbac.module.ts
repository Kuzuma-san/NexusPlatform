import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './entities/roles.entity';
import { Permission } from './entities/permissions.entity';
import { UserRole } from './entities/user-role.entity';
import { RolePermission } from './entities/role-permission.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Role,Permission,UserRole,RolePermission]),
  ],
  controllers: [RbacController],
  providers: [RbacService],
})
export class RbacModule {}
