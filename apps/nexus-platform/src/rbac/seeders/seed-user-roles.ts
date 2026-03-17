import { User } from "../../users/entities/user.entity";
import { Role } from "../entities/roles.entity";
import { USERS } from "../constants/users";
import { USER_ROLES } from "../constants/user-roles";
import { Op } from "sequelize";
import { UserRole } from "../entities/user-role.entity";

export async function seedUserRoles() {
  for(const userName of Object.values(USERS)){//users are object of objects
    const user = await User.findOne({where:{email: userName.email}});
    if (!user) continue;

    const roleNames = USER_ROLES[userName.email]; //array of roles for the user
    if(!roleNames) continue;

    const roles = await Role.findAll({
        where: {name: {[Op.in]:roleNames}}
    });

    for(const role of roles){
        await UserRole.findOrCreate({
            where: {
                userId: user.id,
                roleId: role.id,
            }
        })
    }
  }
}