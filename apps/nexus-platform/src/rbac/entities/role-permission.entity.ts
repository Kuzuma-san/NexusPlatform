import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../../users/entities/user.entity";
import { Role } from "./roles.entity";
import { Permission } from "./permissions.entity";
import { InferAttributes, InferCreationAttributes } from "sequelize";

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
export class RolePermission extends Model<
  InferAttributes<RolePermission>,
  InferCreationAttributes<RolePermission, {omit: 'permission' | 'role'}>
>{
    @Column({
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Role)
    declare roleId: number;
    @BelongsTo(() => Role)
    declare role: Role;

    @Column({
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Permission)
    declare permissionId: number;
    @BelongsTo(() => Permission)
    declare permission: Permission;
}