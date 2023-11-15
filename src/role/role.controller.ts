import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 15,
  ) {
    const roles = await this.roleService.findAll({
      orderBy: { id: 'desc' },
      page: page,
      perPage: perPage,
    });

    return roles;
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.roleService.create(createRoleDto);

    return {
      message: 'Successfully created a new role.',
      role,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const role = await this.roleService.findById(+id);

    return { role };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.roleService.update(+id, updateRoleDto);

    return {
      message: 'Successfully updated role.',
      role,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const role = await this.roleService.remove(+id);

    return {
      message: 'Successfully deleted role.',
      role,
    };
  }
}
