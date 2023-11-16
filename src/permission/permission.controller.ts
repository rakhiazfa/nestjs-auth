import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 15,
  ) {
    const permissions = await this.permissionService.findAll({
      orderBy: { id: 'desc' },
      page: page,
      perPage: perPage,
    });

    return permissions;
  }

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const permission = await this.permissionService.create(createPermissionDto);

    return {
      message: 'Successfully created a new permission.',
      permission,
    };
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const permission = await this.permissionService.findById(id);

    return { permission };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const permission = await this.permissionService.update(
      id,
      updatePermissionDto,
    );

    return {
      message: 'Successfully updated permission.',
      permission,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const permission = await this.permissionService.remove(id);

    return {
      message: 'Successfully deleted permission.',
      permission,
    };
  }
}
