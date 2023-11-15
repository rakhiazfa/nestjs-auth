import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [PrismaModule, UserModule, RoleModule, PermissionModule],
  providers: [],
})
export class AppModule {}
