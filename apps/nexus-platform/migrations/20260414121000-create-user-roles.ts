import { QueryInterface, DataTypes } from "sequelize";

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('user_role', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE', // removing a user removes their role assignments
            },

            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT', // don't delete a role that users currently have
            },

            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },

            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        });

        // Composite unique: same user can't have the same role twice
        await queryInterface.addIndex('user_role', ['userId', 'roleId'], {
            unique: true,
            name: 'unique_user_role',
        });

        // Index on userId — PermissionGuard queries WHERE userId = ?
        // on every protected request. Critical for performance.
        await queryInterface.addIndex('user_role', ['userId'], {
            name: 'idx_user_role_user',
        });

        await queryInterface.addIndex('user_role', ['roleId'], {
            name: 'idx_user_role_role',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.removeIndex('user_role', 'unique_user_role');
        await queryInterface.removeIndex('user_role', 'idx_user_role_user');
        await queryInterface.removeIndex('user_role', 'idx_user_role_role');
        await queryInterface.dropTable('user_role');
    },
};
