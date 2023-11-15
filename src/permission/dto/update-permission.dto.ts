import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
