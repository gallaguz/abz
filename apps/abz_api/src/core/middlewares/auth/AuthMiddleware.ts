import { NextFunction, Request, Response } from 'express';

import { ILogger, IMiddleware, ITokensService } from '../../../common';
import { UnauthorizedError } from '../../errors';

export class AuthMiddleware implements IMiddleware {
    constructor(
        private loggerService: ILogger,
        private tokenService: ITokensService,
    ) {
    }

    async execute(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            if (req.headers.token && typeof req.headers.token === 'string') {
                const valid = await this.tokenService.verifyToken(req.headers.token)
                if (!valid) return next(new UnauthorizedError());
            }
        } catch (error) {
            console.error(error);
            if (error instanceof Error) this.loggerService.error(error.message);
        }
        next();
    }
}
