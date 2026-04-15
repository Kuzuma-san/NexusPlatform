import { DataTypes, QueryInterface } from "sequelize";

export default{
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('roles',{
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
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
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('roles');
    }
}