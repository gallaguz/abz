import { NextFunction, Request, Response } from 'express';

import { ILogger, IMiddleware } from '../../../common';

export class AuthGuardMiddleware implements IMiddleware {
    constructor(private loggerService: ILogger) {}
    async execute(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        // this.loggerService.info(
        //     `[${this.constructor.name}] uuid: ${req.userId}`,
        // );

        if (req.token) return next();

        this.loggerService.error('Not authorized');

        res.status(401).send({ error: 'Not authorized' });
    }
}
