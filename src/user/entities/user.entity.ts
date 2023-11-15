import { Exclude, Transform } from 'class-transformer';

export class UserEntity {
  id: number;
  name: string;
  email: string;

  @Exclude()
  password: string;

  isActive: boolean;

  @Transform(({ value }) =>
    value.map((item) => ({ id: item?.role?.id, name: item?.role?.name })),
  )
  roles?: any;

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
