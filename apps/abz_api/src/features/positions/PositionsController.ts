import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { PositionsService } from './PositionsService';
import { BaseController, ExpressReturnType, ILogger, IPositionsController } from '../../common';
import { APP_KEYS } from '../../config/appKeys';
import { SUCCESS_CODES } from '../../constants';

@injectable()
export class PositionsController extends BaseController implements IPositionsController{
    constructor(
        @inject(APP_KEYS.LoggerService) loggerService: ILogger,
        @inject(APP_KEYS.PositionsService) private positionsService: PositionsService,
    ) {
        super(loggerService, '/positions');

        this.bindRoutes([
            {
                path: '/',
                handler: this.all,
                method: 'get',
            }
        ]);
    }

    async all(req: Request, res: Response, next: NextFunction): Promise<ExpressReturnType> {
        const positions = await this.positionsService.all()
        return this.success(res, SUCCESS_CODES.OK, { positions });
    }
}
