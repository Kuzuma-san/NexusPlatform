import { Role } from "../entities/roles.entity";
import { UserRole } from "../entities/user-role.entity";

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