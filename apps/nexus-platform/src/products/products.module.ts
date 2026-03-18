import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { PermissionGuard } from '../rbac/guards/permissions.guard';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
    RbacModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
