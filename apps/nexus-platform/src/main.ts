/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { seedPermissions } from './rbac/seeders/seed-permissions';
import { seedRoles } from './rbac/seeders/seed-roles';
import { seedRolePermissions } from './rbac/seeders/seed-role-permissions';
import { seedUsers } from './rbac/seeders/seed-users';
import { seedUserRoles } from './rbac/seeders/seed-user-roles';
import { removeGuestRole } from './rbac/seeders/seed-cleanup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Run Seeds (In production, we use migration scripts, but for dev, this works)
  await seedRoles();
  await seedPermissions();
  await seedRolePermissions();
  await seedUsers();
  await seedUserRoles();
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: 'http://localhost:4200', // frontend URL
    credentials: true,
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
