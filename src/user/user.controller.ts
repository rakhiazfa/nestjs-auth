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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 5,
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
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(+id);

    return { user };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(+id, updateUserDto);

    return {
      message: 'Successfully updated user.',
      user,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(+id);

    return {
      message: 'Successfully deleted user.',
      user,
    };
  }
}
