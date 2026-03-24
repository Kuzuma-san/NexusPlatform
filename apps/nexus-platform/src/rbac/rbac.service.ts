import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { permission } from 'process';
import { Permission } from './entities/permissions.entity';
import { RolePermission } from './entities/role-permission.entity';
import { UserRole } from './entities/user-role.entity';
import { getPermissions, getRolePermissions, getUserRoles } from './guards/permissions.guard';

@Injectable()
export class RbacService {
    constructor(
        @InjectModel(Permission)
        private permissionModal : typeof Permission,
        @InjectModel(RolePermission)
        private rolePermissionModal : typeof RolePermission,
        @InjectModel(UserRole)
        private uerRoleModal : typeof UserRole,
        // @InjectModel(RolePermission)
        // private permissionModal : typeof Permission,
    ){}

    async findAllPermissions(userId?: number){
        const userRoles = await getUserRoles(userId);
        const roleIds = userRoles.map(ur => ur.roleId);//same as for each loop..returns an arr of roleIds of same length
        
                // 2. Get role-permissions
        const rolePermissions = await getRolePermissions(roleIds);
        
        const permissionIds = rolePermissions.map(rp => rp.permissionId);//again get the permissionIds using map
        
                // 3. Get permissions
        const permissions = await getPermissions(permissionIds);

        //convert to string array
        const availablePermissionNames = [
            ...new Set(permissions.map(p => p.name))
        ]
        return availablePermissionNames;
    }
}
