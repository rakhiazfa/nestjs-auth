import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { PaginatorTypes, paginator } from '@nodeteam/nestjs-prisma-pagination';
import { User } from './entities/user.entity';
import { handlePrismaClientKnownRequestError } from '@/common/helpers/handle-prisma-error';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatorTypes.PaginatedResult<User>> {
    return paginate(
      this.prisma.user,
      {
        where,
        orderBy,
      },
      {
        page,
        perPage,
      },
    );
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hash = await bcrypt.hash(
        createUserDto.password,
        await bcrypt.genSalt(15),
      );

      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: hash,
        },
      });

      delete user.password;

      return user;
    } catch (error) {
      handlePrismaClientKnownRequestError(error);
    }
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      include: {
        roles: {
          select: {
            role: true,
          },
        },
      },
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not found.');

    delete user.password;

    const result = {
      ...user,
      roles: user.roles.map((role) => {
        return role?.role?.name;
      }),
    };

    return result;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      include: {
        roles: {
          select: {
            role: true,
          },
        },
      },
      where: {
        email,
      },
    });

    if (!user) throw new NotFoundException('User not found.');

    delete user.password;

    const result = {
      ...user,
      roles: user.roles.map((role) => {
        return role?.role?.name;
      }),
    };

    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          name: updateUserDto.name,
          email: updateUserDto.email,
          isActive: updateUserDto.isActive,
        },
      });

      delete user.password;

      return user;
    } catch (error) {
      handlePrismaClientKnownRequestError(error);
    }
  }

  async remove(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id,
        },
      });

      delete user.password;

      return user;
    } catch (error) {
      handlePrismaClientKnownRequestError(error);
    }
  }
}
