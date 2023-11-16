import { Exclude, Transform } from 'class-transformer';
import moment from 'moment';

export class UserEntity {
  id: number;
  name: string;
  email: string;

  @Exclude()
  password: string;

  isActive: boolean;

  @Exclude()
  refreshToken: string;

  @Transform(({ value }) =>
    value.map((item) => ({ id: item?.role?.id, name: item?.role?.name })),
  )
  roles?: any;

  @Transform(({ value }) => moment(value).format('DD/MM/YYYY HH:mm:ss'))
  createdAt: Date;

  @Transform(({ value }) => moment(value).format('DD/MM/YYYY HH:mm:ss'))
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
