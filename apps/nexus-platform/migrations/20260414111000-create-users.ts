import { QueryInterface, DataTypes } from 'sequelize';

/**
 * MIGRATION: create-users
 *
 * A migration file has exactly two functions:
 *   up()   → what to DO   (runs on: npx sequelize-cli db:migrate)
 *   down() → how to UNDO  (runs on: npx sequelize-cli db:migrate:undo)
 *
 * Rule: if `up` creates a table, `down` must drop it.
 *       if `up` adds a column, `down` must remove it.
 *       Every change must be perfectly reversible.
 *
 * The filename timestamp (20260414111000) controls execution ORDER.
 * Sequelize runs migrations in ascending timestamp order.
 * This table must exist before any table that references it (orders, user_roles).
 */

export default {

  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('users', {

      // --- PRIMARY KEY ---
      // Every table needs this. Sequelize adds `id` automatically to your
      // TypeScript model (inherited from Model base class), but migrations
      // are raw SQL — you must define it explicitly here.
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,  // DB generates the value: 1, 2, 3...
        primaryKey: true,     // Unique identifier for each row
        allowNull: false,
      },

      // --- BUSINESS COLUMNS ---
      // Mirror your entity exactly. Same type, same constraints.
      // If your entity says allowNull: false → put allowNull: false here.
      // If your entity says unique: true → put unique: true here.

      username: {
        type: DataTypes.STRING,   // VARCHAR(255) in PostgreSQL
        allowNull: false,
        unique: true,             // DB-level constraint, not just app-level
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,         // Every user must have a password hash
      },

      currentHashedRefreshToken: {
        type: DataTypes.STRING,
        allowNull: true,          // Null when user is logged out — intentional
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,       // New users are active by default
      },

      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,      // New users are unverified by default
      },

      // --- SOFT DELETE COLUMN ---
      // Required because User entity has paranoid: true + @DeletedAt.
      // When you call user.destroy(), Sequelize sets this to NOW() instead
      // of running DELETE. All future queries automatically add
      // WHERE deletedAt IS NULL — the row is invisible but still in the DB.
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,          // Null means NOT deleted. Value means deleted.
      },

      // --- SEQUELIZE TIMESTAMPS ---
      // Sequelize automatically manages these two columns on every
      // create/update. You must define them in the migration even though
      // you never set them manually in your code.
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
    // Undo everything `up` did — in reverse order.
    // `up` created the table → `down` drops it entirely.
    // If `up` had also created an index separately, `down` would
    // remove the index first, then drop the table.
    await queryInterface.dropTable('users');
  },

};
