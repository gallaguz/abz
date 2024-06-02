import { Prisma, User } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { UserEntity } from './UserEntity';
import {
    IConfigService,
    ILogger,
    IUsersService,
    TUserWithPosition,
} from '../../common';
import { APP_KEYS } from '../../config/appKeys';
import { ENV_VARS, PAGE_NOT_FOUND, USER_NOT_FOUND } from '../../constants';
import { BadRequestError, NotFoundError } from '../../core/errors';
import { CacheService } from '../../core/services/CacheService';
import { DatabaseService } from '../../core/services/DatabaseService';

@injectable()
export class UsersService implements IUsersService {
    private readonly hashName: string;
    private readonly ttl: number;

    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
        @inject(APP_KEYS.CacheService) private cacheService: CacheService,
        @inject(APP_KEYS.DatabaseService) private databaseService: DatabaseService,
    ) {
        this.hashName = 'ABZ';
        this.ttl = Number(this.configService.get(ENV_VARS.API_REDIS_CACHE_TTL)) || 3600;
    }

    async all(
        { skip, take, path }: {
            skip: number;
            take: number;
            path: string
        },
    ): Promise<{ usersEntities?: UserEntity[]}> {
        const key = `${this.hashName}:all:${Buffer.from(`${path}${skip}${take}`).toString('base64')}`;
        const usersFromCache = await this.cacheService.get(key);
        if (usersFromCache) {
            return { usersEntities: JSON.parse(usersFromCache) };
        }

        let users: Array<TUserWithPosition>;

        try {
            users = await this.databaseService.client.user.findMany({
                take,
                skip,
                orderBy: {
                    created_at: 'desc',
                },
                include: {
                    position: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        } catch (error) {
            if (error instanceof Error) this.loggerService.error(error);

            throw new BadRequestError();
        }

        if (!users.length) {
            throw new NotFoundError({ message: PAGE_NOT_FOUND });
        }

        const usersEntities = users.map(
            (user) => new UserEntity(user, this.configService),
        );


        await this.cacheService.set(
            key,
            JSON.stringify(usersEntities),
            Math.floor(Date.now() / 1000 + this.ttl),
        );

        return { usersEntities };
    }

    async getCountRows(): Promise<number> {
        return this.databaseService.client.user.count();
    }

    async create(data: Prisma.UserCreateArgs): Promise<User> {

        const user = await this.databaseService.client.user.create(data);
        if (user) {
            await this.cacheService.removeByMatch(`${this.hashName}:all:*`);
        }

        return user;
    }

    async getById({ userId, path }: { userId: User['id'], path: string }): Promise<{ userEntity?: UserEntity} > {
        const key = `${this.hashName}:getById:${Buffer.from(path).toString('base64')}`;
        const userFromCache = await this.cacheService.get(key);

        if (userFromCache) {
            return { userEntity: JSON.parse(userFromCache) };
        }

        const user: TUserWithPosition =
            await this.databaseService.client.user.findFirstOrThrow({
                where: { id: userId },
                include: {
                    position: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

        if (!user) {
            throw new NotFoundError({ message: USER_NOT_FOUND });
        }

        const userEntity = new UserEntity(user, this.configService);


        await this.cacheService.set(
            `${this.hashName}:getById:${Buffer.from(path).toString('base64')}`,
            JSON.stringify(userEntity),
            Math.floor(Date.now() / 1000 + this.ttl),
        );

        return { userEntity };
    }
}

