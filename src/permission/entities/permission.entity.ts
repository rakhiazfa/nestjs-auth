import { Transform } from 'class-transformer';
import moment from 'moment';

export class PermissionEntity {
  id: number;
  name: string;

  @Transform(({ value }) => moment(value).format('DD/MM/YYYY HH:mm:ss'))
  createdAt: Date;

  @Transform(({ value }) => moment(value).format('DD/MM/YYYY HH:mm:ss'))
  updatedAt: Date;

  constructor(partial: Partial<PermissionEntity>) {
    Object.assign(this, partial);
  }
}
