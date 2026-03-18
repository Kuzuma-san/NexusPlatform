import { SetMetadata } from "@nestjs/common";

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermissions = (...permissions: string[]) => 
    SetMetadata(PERMISSIONS_KEY, permissions);

//Setmetadata is used to add custom data to route or controller
// Now route has hidden metadata:GET /login
// metadata: {permissions: some_Permission }..No logic just annotating the routes with extra info...data attached to routes

//The the Guard must check for this decorator in route..
//Eg. Here the permission guard must check if the 'permissions' i.e IS_PERMISSION_KEY contain the permissions i.e the variable