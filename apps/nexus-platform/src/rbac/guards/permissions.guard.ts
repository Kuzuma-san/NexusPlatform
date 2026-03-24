import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";
import { UserRole } from "../entities/user-role.entity";
import { Role } from "../entities/roles.entity";
import { RolePermission } from "../entities/role-permission.entity";
import { Op, where } from "sequelize";
import { Permission } from "../entities/permissions.entity";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector){}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()],
        );
        console.log("REQUIRED PERMISSIONS:", requiredPermissions);
        if (!requiredPermissions) return true;

        const request = context.switchToHttp().getRequest();
        console.log("USER OBJECT:", request.user);
        console.log("USER ID USED:", request.user?.userId);
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException("No user Found.Permission Guard");
        }

        // 1. Get all user roles
        const userRoles = await getUserRoles(user.userId);//array of UserRole objects
        if (userRoles.length === 0) return false;

        const roleIds = userRoles.map(ur => ur.roleId);//same as for each loop..returns an arr of roleIds of same length

        // 2. Get role-permissions
        const rolePermissions = await getRolePermissions(roleIds);

        const permissionIds = rolePermissions.map(rp => rp.permissionId);//again get the permissionIds using map

        // 3. Get permissions
        const permissions = await getPermissions(permissionIds);

        //requiredPermissions is string[] while permissions is Permission[] hence we map out the permission names and create a string[] of all permission names
        const availablePermissionNames = [
            ...new Set(permissions.map(p => p.name))
        ];//Set for removing duplicate permissions...map to extract permission name then giving them to the set which remove duplicates then rest param(...) converts it back to array
        // [...new Set([order:create, order:create])] gives [order:create]

        if(!hasPermission(availablePermissionNames, requiredPermissions)){
            throw new ForbiddenException("Not Authorized to perform this action");
        }
        return true;
    }
}
export function hasPermission(userPermissions: string[], required: string[]): boolean {
        // 4. Check permissions
    for (const perm of required) {
        if (!userPermissions.includes(perm)) {
            return false;
        }
    }
    return true;
}
export async function getUserRoles(userId: number): Promise<UserRole[]>{
    return await UserRole.findAll({
            where: {userId},
    });
}
export async function getRolePermissions(roleIds: number[]): Promise<RolePermission[]>{
    return await RolePermission.findAll({
        where: {
            roleId: {
                [Op.in]: roleIds,//takes arr of roleIds not arr of userRoles objects hence we separated roleIds 
            },//Op is operators provided by sequelize and Op.in is the explicit IN clause which sequelize wouldve called implicitly in our case but explicit is better and cleaner
        },
    });//array of rolePermission objects
}
export async function getPermissions(permissionIds: number[]): Promise<Permission[]>{
    return await Permission.findAll({
        where: {
            id: {
                [Op.in]: permissionIds,
            },
        },
    });
}