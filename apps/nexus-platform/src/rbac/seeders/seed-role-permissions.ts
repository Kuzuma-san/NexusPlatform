import { Role } from '../entities/roles.entity';
import { Permission } from '../entities/permissions.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { ROLES } from '../constants/roles';
import { ROLE_PERMISSIONS } from '../constants/role-permissions';
import { Op } from 'sequelize';

export async function seedRolePermissions() {
  // Loop through your Config Object instead of writing code for each role
  for (const roleName of Object.values(ROLES)) {
    
    // 1. Get the Role
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) continue;

    // 2. Get the Permission Names from your config
    const permissionNames = ROLE_PERMISSIONS[roleName];
    if (!permissionNames || permissionNames.length === 0) continue;

    // 3. Find Permission Entities from DB
    const permissions = await Permission.findAll({
      where: { name: { [Op.in]: permissionNames } } // Explicit In clause...Not writing it works too but be safe for every sequelize version
    });

    // 4. Link them
    for (const perm of permissions) {
      await RolePermission.findOrCreate({
        where: { roleId: role.id, permissionId: perm.id }
      });
    }
  }
}

// export async function seedRolePermissions() {
//     // Get All Permissions 
//   // 1. Get Admin
//   const adminRole = await Role.findOne({ where: { name: ROLES.ADMIN } });
//   const allPermissions = await Permission.findAll();

//   if (adminRole && allPermissions.length > 0) {
//     for (const perm of allPermissions) {
//       // 2. Link them
//       await RolePermission.findOrCreate({
//         where: {
//           roleId: adminRole.id,
//           permissionId: perm.id
//         }
//       });
//     }
//   }
//   // USER
//   const userRole = await Role.findOne({where: {name: ROLES.USER}});
//   const userPermissions = await Permission.findAll({where: {name: ROLE_PERMISSIONS.USER}});
//   if(userRole && userPermissions.length>0){
//     for (const perm of userPermissions) {
//       // 2. Link them
//       await RolePermission.findOrCreate({
//         where: {
//           roleId: userRole.id,
//           permissionId: perm.id
//         }
//       });
//     }
//   }

//   //SELLER
//   const sellerRole = await Role.findOne({where: {name: ROLES.SELLER}});
//   const sellerPermissions = await Permission.findAll({where: {name: ROLE_PERMISSIONS.SELLER}});
//   if(sellerRole && sellerPermissions.length>0){
//     for (const perm of sellerPermissions) {
//       // 2. Link them
//       await RolePermission.findOrCreate({
//         where: {
//           roleId: sellerRole.id,
//           permissionId: perm.id
//         }
//       });
//     }
//   }

//   //GUEST
//   const guestRole = await Role.findOne({where: {name: ROLES.GUEST}});
//   const guestPermissions = await Permission.findAll({where: {name: ROLE_PERMISSIONS.GUEST}});
//   if(guestRole && guestPermissions.length>0){
//     for (const perm of guestPermissions) {
//       // 2. Link them
//       await RolePermission.findOrCreate({
//         where: {
//           roleId: guestRole.id,
//           permissionId: perm.id
//         }
//       });
//     }
//   }
  
// }

//Method 2
// export async function seedRolePermissions() {
//   const roles = await Role.findAll();
//   const permissions = await Permission.findAll();

//   // Helper to find ID
//   const getRoleId = (name: string) => roles.find(r => r.name === name)?.id;

//   // 1. ADMIN (God Mode)
//   await assignPermissions(getRoleId('admin'), permissions);

//   // 2. SELLER (Product Manager)
//   // Logic: Allow anything starting with 'product:' OR 'review:'
//   const sellerPerms = permissions.filter(p => 
//     p.name.startsWith('product:') || p.name.startsWith('review:')
//   );
//   await assignPermissions(getRoleId('seller'), sellerPerms);

//   // 3. USER (Shopper)
//   // Logic: Allow 'order:create', 'review:create', plus all 'read' permissions
//   const userPerms = permissions.filter(p => 
//     p.name.endsWith(':read') || 
//     p.name === 'order:create' || 
//     p.name === 'review:create'
//   );
//   await assignPermissions(getRoleId('user'), userPerms);

//   // 4. GUEST (Window Shopper)
//   const guestPerms = permissions.filter(p => p.name === 'product:read');
//   await assignPermissions(getRoleId('guest'), guestPerms);
// }

// // Reusable Helper Function
// async function assignPermissions(roleId: number | undefined, perms: Permission[]) {
//   if (!roleId) return;
//   for (const p of perms) {
//     await RolePermission.findOrCreate({
//       where: { roleId, permissionId: p.id }
//     });
//   }
// }