import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { TokensService } from './TokensService';
import { BaseController, ExpressReturnType, ILogger, ITokensControllerInterface } from '../../common';
import { APP_KEYS } from '../../config/appKeys';
import { SUCCESS_CODES } from '../../constants';

@injectable()
export class TokensController extends BaseController implements ITokensControllerInterface{
    constructor(
        @inject(APP_KEYS.LoggerService) loggerService: ILogger,
        @inject(APP_KEYS.TokensService) private tokensService: TokensService,
    ) {
        super(loggerService, '/token');

        this.bindRoutes([
            {
                path: '/',
                handler: this.token,
                method: 'get',
            }
        ]);
    }

    async token(req: Request, res: Response, next: NextFunction): Promise<ExpressReturnType> {
        const token = await this.tokensService.generateJwtToken();
        return this.success(res, SUCCESS_CODES.OK, { token });
    }
}
