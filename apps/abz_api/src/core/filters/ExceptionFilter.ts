import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { IExceptionFilter, ILogger } from '../../common';
import { APP_KEYS } from '../../config/appKeys';
import { CLIENT_ERROR_CODES, STATUS_CODES_MESSAGES_MAP, SUCCESS_CODES } from '../../constants';
import { NotModifiedError, RootHttpError } from '../errors';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
    ) {
        this.loggerService.debug(`[ ${this.constructor.name} ] Registered`);
    }

    catch(
        err: Error | RootHttpError,
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {

        if (err instanceof NotModifiedError) {
            this.loggerService.debug(JSON.stringify(err));
            res.status(SUCCESS_CODES.NOT_MODIFIED);
            res.end();
            return;
        }

        if (err instanceof RootHttpError) {
            this.loggerService.error(JSON.stringify(err));
            res.status(err.statusCode).send({
                success: false,
                message: err.message,
                ...(err.fails && {
                    fails: err.fails,
                }),
            });
        } else {
            this.loggerService.error(JSON.stringify(err));
            res.status(CLIENT_ERROR_CODES.UNAUTHORIZED).send({
                err: STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR_CODES.UNAUTHORIZED],
            });
        }
        next();
    }
}
