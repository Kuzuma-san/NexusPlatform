import { Permission } from "../entities/permissions.entity";
export const PERMISSIONS = [
  'user:create',
  'user:read',
  'user:update',
  'user:delete',

  'order:create',
  'order:read',
  'order:update',
  'order:delete',

  'product:create',
  'product:read',
  'product:update',
  'product:delete',

  'review:create',
  'review:read',
  'review:update',
  'review:delete',
];

export async function seedPermissions() {
  for (const permission of PERMISSIONS) {
    await Permission.findOrCreate({
      where: { name: permission }
    });
  }
}