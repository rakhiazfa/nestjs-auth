import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { PaginatorTypes, paginator } from '@nodeteam/nestjs-prisma-pagination';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class RoleService {
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
  }): Promise<PaginatorTypes.PaginatedResult<Role>> {
    return paginate(
      this.prisma.role,
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

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
      },
    });
  }

  async findById(id: number): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      include: {
        permissions: {
          select: { permission: { select: { name: true } } },
        },
      },
      where: {
        id,
      },
    });

    if (!role) throw new NotFoundException('Role not found.');

    const result = {
      ...role,
      permissions: role.permissions.map(
        (permission) => permission?.permission?.name,
      ),
    };

    return result;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    return await this.prisma.role.update({
      where: {
        id,
      },
      data: {
        name: updateRoleDto.name,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async remove(id: number): Promise<Role> {
    return await this.prisma.role.delete({
      where: {
        id,
      },
    });
  }
}
