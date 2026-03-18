import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// import { AuthGuard } from '../auth/auth.guard'; // custom AuthGuard
import { AuthGuard } from '@nestjs/passport'; //passport AuthGuard
import { Public } from '../auth/decorators/public.decorator';
import { RequirePermissions } from '../rbac/decorators/permissions.decorator';
import { PERMISSIONS } from '../rbac/constants/permissions';
import { PermissionGuard } from '../rbac/guards/permissions.guard';

// @UseGuards(PermissionGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard('jwt'))
  @RequirePermissions(PERMISSIONS.PRODUCT_CREATE)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @RequirePermissions(PERMISSIONS.PRODUCT_READ)
  @Get()
  findAll(@Request() request) {
    return this.productsService.findAll();
  }

  @RequirePermissions(PERMISSIONS.PRODUCT_READ)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @RequirePermissions(PERMISSIONS.PRODUCT_UPDATE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @UseGuards(AuthGuard('jwt'),PermissionGuard)//first adds the user to the request
  @RequirePermissions(PERMISSIONS.PRODUCT_DELETE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
