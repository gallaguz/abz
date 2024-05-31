import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TokensService } from './TokensService';
import { BaseController , ExpressReturnType , IConfigService , ILogger , ITokensControllerInterface , IUsersService } from '../../common';
import { APP_KEYS } from '../../config/appKeys';
import { SUCCESS_CODES } from '../../constants';
import { AuthMiddleware } from '../../core/middlewares/auth/AuthMiddleware';
import { FilesService } from '../../core/services/FileService';

@injectable()
export class TokensController extends BaseController implements ITokensControllerInterface{
    constructor(
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
        @inject(APP_KEYS.LoggerService) loggerService: ILogger,
        @inject(APP_KEYS.UsersService) private userService: IUsersService,
        @inject(APP_KEYS.FilesService) private filesService: FilesService,
        @inject(APP_KEYS.TokensService) private tokensService: TokensService,
    ) {
        super(loggerService, '/token');

        this.bindRoutes([
            {
                path: '/',
                handler: this.token,
                method: 'get',
                // middlewares: [
                //     new ParamsValidateMiddleware(this.loggerService, UsersById.DTO)
                // ]
            },
            {
                path: '/test',
                handler: this.token,
                method: 'get',
                middlewares: [
                    new AuthMiddleware(this.loggerService, this.tokensService)
                ]
            },
        ]);
    }

    async token(req: Request, res: Response, next: NextFunction): Promise<ExpressReturnType> {
        const token = await this.tokensService.generateJwtToken();
        return this.success(res, SUCCESS_CODES.OK, { token });
    }
}
