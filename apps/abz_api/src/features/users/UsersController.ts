import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { UserEntity } from './UserEntity';
import {
    BaseController,
    ExpressReturnType,
    IConfigService,
    ILogger,
    IUsersController,
    IUsersService,
} from '../../common';
import { APP_KEYS } from '../../config/appKeys';
import {
    CLIENT_ERROR_CODES,
    ENV_VARS,
    SOMETHING_GOES_WRONG,
    SUCCESS_CODES,
    USER_ADDED,
    USER_NOT_FOUND,
} from '../../constants';
import { UsersAll } from '../../contracts/users/all';
import { UsersById } from '../../contracts/users/byId';
import { UsersRegister } from '../../contracts/users/register';
import { NotFoundError, NotModifiedError, RootHttpError } from '../../core/errors';
import { AuthMiddleware } from '../../core/middlewares/auth/AuthMiddleware';
import { BodyValidateMiddleware } from '../../core/middlewares/validation/BodyValidateMiddleware';
import { ParamsValidateMiddleware } from '../../core/middlewares/validation/ParamsValidateMiddleware';
import { PhotoValidateMiddleware } from '../../core/middlewares/validation/PhotoValidateMiddleware';
import { QueryValidateMiddleware } from '../../core/middlewares/validation/QueryValidateMiddleware';
import { CacheService } from '../../core/services/CacheService';
import { FilesService } from '../../core/services/FileService';
import { TokensService } from '../tokens/TokensService';

@injectable()
export class UsersController
    extends BaseController
    implements IUsersController
{
    private readonly pageCountRows: number;

    constructor(
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
        @inject(APP_KEYS.LoggerService) loggerService: ILogger,
        @inject(APP_KEYS.UsersService) private userService: IUsersService,
        @inject(APP_KEYS.FilesService) private filesService: FilesService,
        @inject(APP_KEYS.TokensService) private tokensService: TokensService,
        @inject(APP_KEYS.CacheService) private cacheService: CacheService,
    ) {
        super(loggerService, '/users');

        this.pageCountRows = Number(
            this.configService.get(ENV_VARS.API_PAGE_COUNT_ROWS),
        );

        this.bindRoutes([
            {
                path: '/register',
                handler: this.register,
                method: 'post',
                middlewares: [
                    new AuthMiddleware(this.loggerService, this.tokensService),
                    new PhotoValidateMiddleware(
                        this.loggerService,
                        this.configService,
                        UsersRegister.Photo,
                    ),
                    new BodyValidateMiddleware(
                        this.loggerService,
                        UsersRegister.DTO,
                    ),
                ],
            },
            {
                path: '/',
                handler: this.all,
                method: 'get',
                middlewares: [
                    new QueryValidateMiddleware(
                        this.loggerService,
                        UsersAll.DTO,
                    ),
                ],
            },
            {
                path: '/:id',
                handler: this.getById,
                method: 'get',
                middlewares: [
                    new ParamsValidateMiddleware(
                        this.loggerService,
                        UsersById.DTO,
                    ),
                ],
            },
        ]);
    }

    async all(
        req: UsersAll.Request,
        res: Response,
        next: NextFunction,
    ): Promise<ExpressReturnType> {
        let usersEntities;

        const { page, count } = req.query;
        const path = req.path;
        const take = count || this.pageCountRows;
        const skip = (page ? page - 1 : 0) * take;

        try {
            const result = await this.userService.all({ skip, take, path });

            usersEntities = result.usersEntities;

        } catch (error) {
            console.error(error);
            if (error instanceof RootHttpError) {
                this.loggerService.error(error.message);
                return this.fail(res, error.statusCode, {
                    fails: [error.message],
                });
            }
            return this.fail(res, CLIENT_ERROR_CODES.UNPROCESSABLE_ENTITY, {
                fails: [SOMETHING_GOES_WRONG],
            });
        }

        const countRows = await this.userService.getCountRows();

        const currentPage = page || 1;
        const totalPages = Math.ceil(countRows / take) || 1;

        const nextPage = currentPage + 1 > totalPages ? null : currentPage + 1;
        const prevPage = currentPage - 1 < 1 ? null : currentPage - 1;

        const apiProtocol = this.configService.get(ENV_VARS.API_PROTOCOL);
        const apiDomainName = this.configService.get(ENV_VARS.API_HOST);
        const nextUrl = nextPage
            ? `${apiProtocol}://${apiDomainName}/api/v1${this.path}?page=${nextPage}&count=${take}`
            : null;
        const prevUrl = prevPage
            ? `${apiProtocol}://${apiDomainName}/api/v1${this.path}?page=${prevPage}&count=${take}`
            : null;

        const body = {
            page: currentPage,
            total_pages: totalPages,
            total_users: countRows,
            count: take,
            links: {
                next_url: nextUrl,
                prev_url: prevUrl,
            },
            users: usersEntities || [],
        };

        return this.success(res, SUCCESS_CODES.OK, body);
    }


    async getById(
        req: UsersById.Request,
        res: Response,
        next: NextFunction,
    ): Promise<ExpressReturnType> {
        let userEntity;

        const path = req.path;
        const userId = req.params.id

        try {
            const result = await this.userService.getById(
                { userId, path }
            );

            userEntity = result.userEntity;
        } catch (error) {
            console.error(error);
            if (error instanceof RootHttpError) {
                this.loggerService.error(error.message);
                return this.fail(res, error.statusCode, {
                    fails: [error.message],
                });
            }

            return this.fail(res, CLIENT_ERROR_CODES.UNPROCESSABLE_ENTITY, {
                fails: [SOMETHING_GOES_WRONG],
            });
        }

        return this.success(res, SUCCESS_CODES.OK, { user: userEntity });
    }

    async register(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<ExpressReturnType> {
        try {
            const { name } = await this.filesService.handlePhoto(req.file);

            const user = await this.userService.create({
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    position_id: req.body.position_id,
                    photo: name,
                },
            });

            return this.success(res, SUCCESS_CODES.CREATED, {
                user_id: user.id,
                message: USER_ADDED,
            });
        } catch (error) {
            console.error(error);
            if (error instanceof RootHttpError) {
                this.loggerService.error(error.message);
                return this.fail(res, error.statusCode, {
                    fails: [error.message],
                });
            }

            return this.fail(res, CLIENT_ERROR_CODES.UNPROCESSABLE_ENTITY, {
                fails: [SOMETHING_GOES_WRONG],
            });
        }
    }
}
