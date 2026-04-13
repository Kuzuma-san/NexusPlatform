import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../../users/entities/user.entity";
import { Role } from "../../rbac/entities/roles.entity";
import { InferAttributes, InferCreationAttributes } from "sequelize";

@Table({
 tableName: "user_role",
 indexes: [
   {
     unique: true,
     fields: ["userId", "roleId"]//implementing unique constraints that means the userId and roleId togather must be unique. i.e same user cannot have a same role twice
                                 //A unique constraint tells the database: These columns together must always be unique
   },
   {
     name: "idx_user_role_user",
     fields: ["userId"] //making userId and roleId indexes
   },//eg. 2million rows in db and query searched for where userId is 25. Instead of checking all rows we only check rows where userId is 25
   {
     name: "idx_user_role_role",
     fields: ["roleId"]
   }
 ]
})
export class UserRole extends Model<
    InferAttributes<UserRole>,
    InferCreationAttributes<UserRole, {omit: 'role' | 'user'}>
    >{
    @Column({
        type: DataType.INTEGER,
    })
    @ForeignKey(() => User)
    declare userId: number;
    @BelongsTo(() => User)
    declare user: User;

    @Column({
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Role)
    declare roleId: number;
    @BelongsTo(() => Role)
    declare role: Role;
    
}