import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import  { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { JwtModule } from '@nestjs/jwt';
import { Product } from '../products/entities/product.entity';
import { AuthModule } from '../auth/auth.module';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    OrdersModule,
    ReviewsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      models: [User,Product,OrderItem,Order]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
