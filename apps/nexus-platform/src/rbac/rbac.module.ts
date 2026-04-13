import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './entities/roles.entity';
import { Permission } from './entities/permissions.entity';
import { UserRole } from './entities/user-role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { PermissionGuard } from './guards/permissions.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([Role,Permission,UserRole,RolePermission]),
  ],
  controllers: [RbacController],
  providers: [RbacService, PermissionGuard],
  exports: [RbacService, PermissionGuard]
})
export class RbacModule {}
