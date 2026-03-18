import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequirePermissions } from '../rbac/decorators/permissions.decorator';
import { PERMISSIONS } from '../rbac/constants/permissions';
import { PermissionGuard } from '../rbac/guards/permissions.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(PERMISSIONS.ORDER_CREATE)
  @Post()
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto, req.user?.userId);
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(PERMISSIONS.ORDER_READ)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(PERMISSIONS.ORDER_READ)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(PERMISSIONS.ORDER_UPDATE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(PERMISSIONS.ORDER_DELETE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
