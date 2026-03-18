import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequirePermissions } from '../rbac/decorators/permissions.decorator';
import { PERMISSIONS } from '../rbac/constants/permissions';
import { PermissionGuard } from '../rbac/guards/permissions.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post() // only signup can create user
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(PERMISSIONS.USER_READ)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(PERMISSIONS.USER_READ)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(PERMISSIONS.USER_UPDATE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(PERMISSIONS.USER_DELETE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
