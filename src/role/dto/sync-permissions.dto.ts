import { IsArray, IsNotEmpty } from 'class-validator';

export class SyncPermissionsDto {
  @IsArray()
  @IsNotEmpty()
  permissions: number[];
}
