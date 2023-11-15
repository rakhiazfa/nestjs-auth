import { IsArray, IsNotEmpty } from 'class-validator';

export class SyncRolesDto {
  @IsArray()
  @IsNotEmpty()
  roles: number[];
}
