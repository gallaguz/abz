import { ClassConstructor } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
import multer, { memoryStorage } from 'multer';

import { RootValidateMiddleware } from './RootValidateMiddleware';
import { IConfigService, ILogger, IMiddleware } from '../../../common';
import {
    ENV_VARS,
    VALIDATION_FAILED,
    VALIDATION_TYPE,
    WRONG_PHOTO_SIZE,
} from '../../../constants';
import { UnprocessableEntityError } from '../../errors';

export class PhotoValidateMiddleware
    extends RootValidateMiddleware
    implements IMiddleware
{
    private readonly mxPhotoSize: number;
    constructor(
        loggerService: ILogger,
        private configService: IConfigService,
        classToValidate: ClassConstructor<object>,
    ) {
        super(loggerService, classToValidate, VALIDATION_TYPE.FILE);
        this.mxPhotoSize = Number(
            this.configService.get(ENV_VARS.API_MAX_PHOTO_SIZE),
        );
    }

    async execute(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const storage = memoryStorage();

        const upload = multer({
            storage,
            limits: { fileSize: this.mxPhotoSize },
        }).single('photo');

        upload(req, res, (error) => {
            if (error) {
                next(
                    new UnprocessableEntityError({
                        message: VALIDATION_FAILED,
                        fails: [WRONG_PHOTO_SIZE],
                        originalError: error,
                    }),
                );
            }

            void this._execute(req, res, next);
        });
    }
}
