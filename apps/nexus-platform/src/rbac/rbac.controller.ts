import { Body, Controller, Get, UseGuards, Request } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from '../interfaces/express';

@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get("/permissions")
  findAllPermissions(
    @Request() req: AuthRequest
  ){
    return this.rbacService.findAllPermissions((+req.user.userId));
  }
}
