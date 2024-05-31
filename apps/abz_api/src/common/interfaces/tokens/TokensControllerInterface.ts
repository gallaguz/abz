import { NextFunction, Request, Response } from 'express';

import { ExpressReturnType } from '../BaseControllerInterface';

export interface ITokensControllerInterface {
    token(req: Request, res: Response, next: NextFunction): Promise<ExpressReturnType>
}
