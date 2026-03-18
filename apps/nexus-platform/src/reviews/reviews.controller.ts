import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequirePermissions } from '../rbac/decorators/permissions.decorator';
import { PERMISSIONS } from '../rbac/constants/permissions';
import { PermissionGuard } from '../rbac/guards/permissions.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(PERMISSIONS.REVIEW_CREATE)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(PERMISSIONS.REVIEW_UPDATE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(PERMISSIONS.REVIEW_DELETE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
