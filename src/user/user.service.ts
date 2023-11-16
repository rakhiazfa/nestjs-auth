import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { paginate } from '@/common/helpers/paginate';
import bcrypt from 'bcrypt';
import { PaginationRequest } from '@/common/types/pagination-request.type';
import { SyncRolesDto } from './dto/sync-roles.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    where,
    orderBy,
    page,
    perPage,
  }: PaginationRequest): Promise<PaginatorTypes.PaginatedResult<UserEntity>> {
    const result = (await paginate(
      this.prisma.user,
      {
        where,
        orderBy,
      },
      {
        page,
        perPage,
      },
    )) as PaginatorTypes.PaginatedResult<UserEntity>;

    result.data = result.data.map((user) => new UserEntity(user));

    return result;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
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

    return new UserEntity(user);
  }

  async findById(id: number): Promise<UserEntity> {
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

    return new UserEntity(user);
  }

  async findByEmail(email: string): Promise<UserEntity> {
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

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        isActive: updateUserDto.isActive,
        updatedAt: new Date().toISOString(),
      },
    });

    return new UserEntity(user);
  }

  async remove(id: number): Promise<UserEntity> {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return new UserEntity(user);
  }

  async syncRoles(id: number, syncRolesDto: SyncRolesDto): Promise<UserEntity> {
    await this.prisma.userHasRoles.deleteMany({
      where: {
        userId: id,
      },
    });

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        roles: {
          create: syncRolesDto.roles?.map((id) => ({
            role: { connect: { id } },
          })),
        },
      },
      include: {
        roles: {
          select: {
            role: true,
          },
        },
      },
    });

    return new UserEntity(user);
  }
}
