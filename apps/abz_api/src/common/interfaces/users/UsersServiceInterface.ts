import { User, Prisma } from '@prisma/client';

import { UserEntity } from '../../../features/users/UserEntity';

export interface IUsersService {
  create(data: Prisma.UserCreateArgs): Promise<User>;
  all(obj: {
      skip: number;
      take: number;
      path: string
  }): Promise<{ usersEntities?: UserEntity[] }>;
  getCountRows(): Promise<number>;
  getById(obj: {
      userId: User['id'],
      path: string
  }): Promise<{ userEntity?: UserEntity }>;
}
