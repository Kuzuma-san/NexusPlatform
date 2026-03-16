import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../../users/entities/user.entity";
import { Role } from "./roles.entity";
import { Permission } from "./permissions.entity";

@Table({
 tableName: "role_permission",
 indexes: [
   {
     unique: true,
     fields: ["roleId", "permissionId"]
   },
   {
     name: "idx_role_permission_role",
     fields: ["roleId"]
   },
   {
     name: "idx_role_permission_permission",
     fields: ["permissionId"]
   }
 ]
})
export class RolePermission extends Model<RolePermission>{
    @Column({
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Role)
    roleId: number;
    @BelongsTo(() => Role)
    role: Role;

    @Column({
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Permission)
    permissionId: number;
    @BelongsTo(() => Permission)
    permission: Permission;
}