import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationRequest } from '@/common/types/pagination-request.type';
import { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { paginate } from '@/common/helpers/paginate';
import { PermissionEntity } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    where,
    orderBy,
    page,
    perPage,
  }: PaginationRequest): Promise<
    PaginatorTypes.PaginatedResult<PermissionEntity>
  > {
    const result = (await paginate(
      this.prisma.permission,
      {
        where,
        orderBy,
      },
      {
        page,
        perPage,
      },
    )) as PaginatorTypes.PaginatedResult<PermissionEntity>;

    result.data = result.data.map(
      (permission) => new PermissionEntity(permission),
    );

    return result;
  }

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    const permission = await this.prisma.permission.create({
      data: {
        name: createPermissionDto.name,
      },
    });

    return new PermissionEntity(permission);
  }

  async findById(id: number): Promise<PermissionEntity> {
    const permission = await this.prisma.permission.findUnique({
      where: {
        id,
      },
    });

    if (!permission) throw new NotFoundException('Permission not found.');

    return new PermissionEntity(permission);
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionEntity> {
    const permission = await this.prisma.permission.update({
      where: {
        id,
      },
      data: {
        name: updatePermissionDto.name,
        updatedAt: new Date().toISOString(),
      },
    });

    return new PermissionEntity(permission);
  }

  async remove(id: number): Promise<PermissionEntity> {
    const permission = await this.prisma.permission.delete({
      where: {
        id,
      },
    });

    return new PermissionEntity(permission);
  }
}
