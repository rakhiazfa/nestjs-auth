import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { paginate } from '@/common/helpers/paginate';
import { PaginationRequest } from '@/common/types/pagination-request.type';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    where,
    orderBy,
    page,
    perPage,
  }: PaginationRequest): Promise<PaginatorTypes.PaginatedResult<RoleEntity>> {
    const result = (await paginate(
      this.prisma.role,
      {
        where,
        orderBy,
      },
      {
        page,
        perPage,
      },
    )) as PaginatorTypes.PaginatedResult<RoleEntity>;

    result.data = result.data.map((role) => new RoleEntity(role));

    return result;
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const role = await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
      },
    });

    return new RoleEntity(role);
  }

  async findById(id: number): Promise<RoleEntity> {
    const role = await this.prisma.role.findUnique({
      include: {
        permissions: {
          select: { permission: true },
        },
      },
      where: {
        id,
      },
    });

    if (!role) throw new NotFoundException('Role not found.');

    return new RoleEntity(role);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.prisma.role.update({
      where: {
        id,
      },
      data: {
        name: updateRoleDto.name,
        updatedAt: new Date().toISOString(),
      },
    });

    return new RoleEntity(role);
  }

  async remove(id: number): Promise<RoleEntity> {
    const role = await this.prisma.role.delete({
      where: {
        id,
      },
    });

    return new RoleEntity(role);
  }
}
