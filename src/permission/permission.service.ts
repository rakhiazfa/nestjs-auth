import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationRequest } from '@/common/types/pagination-request.type';
import { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { Permission } from '@prisma/client';
import { paginate } from '@/common/helpers/paginate';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    where,
    orderBy,
    page,
    perPage,
  }: PaginationRequest): Promise<PaginatorTypes.PaginatedResult<Permission>> {
    return paginate(
      this.prisma.permission,
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

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return await this.prisma.permission.create({
      data: {
        name: createPermissionDto.name,
      },
    });
  }

  async findById(id: number): Promise<Permission> {
    const permission = await this.prisma.permission.findUnique({
      where: {
        id,
      },
    });

    if (!permission) throw new NotFoundException('Permission not found.');

    return permission;
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    return await this.prisma.permission.update({
      where: {
        id,
      },
      data: {
        name: updatePermissionDto.name,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async remove(id: number): Promise<Permission> {
    return await this.prisma.permission.delete({
      where: {
        id,
      },
    });
  }
}
