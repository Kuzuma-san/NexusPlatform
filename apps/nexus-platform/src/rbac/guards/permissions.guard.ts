import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";
import { RbacService } from "../rbac.service";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private rbacService: RbacService
    ){}

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
        const roles = user.roles; //roles[]
        if(roles.length === 0) return false; // if user has no roles return not permitted

        // 1. Get all user roles
        // const userRoles = await this.rbacService.getUserRoles(user.userId);//array of UserRole objects
        // if (userRoles.length === 0) return false;

        // const roleIds = userRoles.map(ur => ur.roleId);//same as for each loop..returns an arr of roleIds of same length
        const roleIds = await this.rbacService.getRoleIds(user.roles);

        // 2. Get role-permissions
        const rolePermissions = await this.rbacService.getRolePermissions(roleIds);

        const permissionIds = rolePermissions.map(rp => rp.permissionId);//again get the permissionIds using map

        // 3. Get permissions
        const permissions = await this.rbacService.getPermissions(permissionIds);

        //requiredPermissions is string[] while permissions is Permission[] hence we map out the permission names and create a string[] of all permission names
        const availablePermissionNames = [
            ...new Set(permissions.map(p => p.name))
        ];//Set for removing duplicate permissions...map to extract permission name then giving them to the set which remove duplicates then rest param(...) converts it back to array
        // [...new Set([order:create, order:create])] gives [order:create]

        if(!this.rbacService.hasPermission(availablePermissionNames, requiredPermissions)){
            throw new ForbiddenException("Not Authorized to perform this action");
        }
        return true;
    }
}