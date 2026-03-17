import { Role } from "../entities/roles.entity";

export const ROLES = [
  'admin',
  'seller',
  'user',
  // 'guest',
];

export async function seedRoles() {
  for (const role of ROLES) {
    await Role.findOrCreate({
      where: { name: role }
    });
  }
}