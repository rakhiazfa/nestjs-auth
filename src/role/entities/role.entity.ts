import { Transform } from 'class-transformer';
import moment from 'moment';

export class RoleEntity {
  id: number;
  name: string;

  @Transform(({ value }) =>
    value.map((item) => ({
      id: item?.permission?.id,
      name: item?.permission?.name,
    })),
  )
  permissions?: any;

  @Transform(({ value }) => moment(value).format('DD/MM/YYYY HH:mm:ss'))
  createdAt: Date;

  @Transform(({ value }) => moment(value).format('DD/MM/YYYY HH:mm:ss'))
  updatedAt: Date;

  constructor(partial: Partial<RoleEntity>) {
    Object.assign(this, partial);
  }
}
