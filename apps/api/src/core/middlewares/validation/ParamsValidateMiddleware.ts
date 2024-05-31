import { ClassConstructor } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';

import { RootValidateMiddleware } from './RootValidateMiddleware';
import { ILogger, IMiddleware } from '../../../common';
import { VALIDATION_TYPE } from '../../../constants';

export class ParamsValidateMiddleware extends RootValidateMiddleware implements IMiddleware {
    constructor(
        loggerService: ILogger,
        classToValidate: ClassConstructor<object>,
    ) {
        super(loggerService, classToValidate, VALIDATION_TYPE.PARAMS);
    }

    async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
        void this._execute(req, res, next);
    }
}
