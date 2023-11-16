import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SyncRolesDto } from './dto/sync-roles.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 15,
  ) {
    const users = await this.userService.findAll({
      orderBy: { id: 'desc' },
      page: page,
      perPage: perPage,
    });

    return users;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    return {
      message: 'Successfully created a new user.',
      user,
    };
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findById(id);

    return { user };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, updateUserDto);

    return {
      message: 'Successfully updated user.',
      user,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.remove(id);

    return {
      message: 'Successfully deleted user.',
      user,
    };
  }

  @Post(':id/sync-roles')
  async syncRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() syncRolesDto: SyncRolesDto,
  ) {
    const user = await this.userService.syncRoles(id, syncRolesDto);

    return {
      message: 'Successfully synchronized roles.',
      user,
    };
  }
}
