import { NextFunction, Request, Response } from 'express';

import { UsersAll } from '../../../contracts/users/all';
import { ExpressReturnType, IBaseController } from '../BaseControllerInterface';

export interface IUsersController extends IBaseController {
    register(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<ExpressReturnType>;
    all(req: UsersAll.Request, res: Response, next: NextFunction): Promise<ExpressReturnType>;
    getById(req: Request, res: Response, next: NextFunction): Promise<ExpressReturnType>;
}
