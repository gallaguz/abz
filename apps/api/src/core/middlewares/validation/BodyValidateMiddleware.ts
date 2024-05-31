import { ClassConstructor } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';

import { RootValidateMiddleware } from './RootValidateMiddleware';
import { ILogger, IMiddleware } from '../../../common';
import {
    SOMETHING_GOES_WRONG,
    VALIDATION_FAILED,
    VALIDATION_TYPE,
} from '../../../constants';
import { UnprocessableEntityError } from '../../errors';

export class BodyValidateMiddleware
    extends RootValidateMiddleware
    implements IMiddleware
{
    constructor(
        loggerService: ILogger,
        classToValidate: ClassConstructor<object>,
    ) {
        super(loggerService, classToValidate, VALIDATION_TYPE.BODY);
    }

    async execute(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        void this._execute(req, res, next);
    }
}
