import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from './entities/permissions.entity';
import { RolePermission } from './entities/role-permission.entity';
import { UserRole } from './entities/user-role.entity';
import { Op } from 'sequelize';
import { Role } from './entities/roles.entity';

@Injectable()
export class RbacService {
    constructor(
        @InjectModel(Permission)
        private permissionModal : typeof Permission,
        @InjectModel(RolePermission)
        private rolePermissionModal : typeof RolePermission,
        @InjectModel(Role)
        private roleModal : typeof Role,
        @InjectModel(UserRole)
        private userRoleModal : typeof UserRole,
    ){}

    async findAllPermissions(userId?: number){
        if (!userId) {
            // Return ALL permissions in the system (for Admin UI dropdowns)
            return this.permissionModal.findAll().then(p => p.map(x => x.name));
        }
        const userRoles = await this.getUserRoles(userId);
        const roleIds = userRoles.map(ur => ur.roleId);//same as for each loop..returns an arr of roleIds of same length
        
                // 2. Get role-permissions
        const rolePermissions = await this.getRolePermissions(roleIds);
        
        const permissionIds = rolePermissions.map(rp => rp.permissionId);//again get the permissionIds using map
        
                // 3. Get permissions
        const permissions = await this.getPermissions(permissionIds);

        //convert to string array
        const availablePermissionNames = [
            ...new Set(permissions.map(p => p.name))
        ]
        return availablePermissionNames;
    }
    hasPermission(userPermissions: string[], required: string[]): boolean {
            // 4. Check permissions
        for (const perm of required) {
            if (!userPermissions.includes(perm)) {
                return false;
            }
        }
        return true;
    }
    async getUserRoles(userId: number): Promise<UserRole[]>{
        return await this.userRoleModal.findAll({
                where: {userId},
        });
    }
    async getRoles(roleIds: number[]) {
        return await this.roleModal.findAll({
            where: {
                id: {
                    [Op.in]: roleIds,
                }
            }
        })
    }
    async getRolePermissions(roleIds: number[]): Promise<RolePermission[]>{
        return await this.rolePermissionModal.findAll({
            where: {
                roleId: {
                    [Op.in]: roleIds,//takes arr of roleIds not arr of userRoles objects hence we separated roleIds 
                },//Op is operators provided by sequelize and Op.in is the explicit IN clause which sequelize wouldve called implicitly in our case but explicit is better and cleaner
            },
        });//array of rolePermission objects
    }
    async getPermissions(permissionIds: number[]): Promise<Permission[]>{
        return await this.permissionModal.findAll({
            where: {
                id: {
                    [Op.in]: permissionIds,
                },
            },
        });
    }
    async getRoleIds(roleNames: string[]){
        const roles =  await this.roleModal.findAll({
            where: {
                name: {
                    [Op.in]: roleNames,
                }
            }
        });
        return roles.map(role => role.id);
    }
}
