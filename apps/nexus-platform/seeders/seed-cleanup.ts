import { Role } from "../src/rbac/entities/roles.entity";
import { UserRole } from "../src/rbac/entities/user-role.entity";

export async function removeGuestRole() {
  const guestRole = await Role.findOne({
    where: { name: 'guest' },
  });

  if (!guestRole) return;

  // remove relations
  await UserRole.destroy({
    where: { roleId: guestRole.id },
  });

  // remove role
  await guestRole.destroy();
}