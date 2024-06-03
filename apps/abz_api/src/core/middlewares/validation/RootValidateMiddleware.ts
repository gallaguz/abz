import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

import { ILogger } from '../../../common';
import {
    SOMETHING_GOES_WRONG,
    VALIDATION_FAILED,
    VALIDATION_TYPE,
} from '../../../constants';
import { UnprocessableEntityError } from '../../errors';

export abstract class RootValidateMiddleware {
    protected constructor(
        private loggerService: ILogger,
        protected classToValidate: ClassConstructor<object>,
        private validationType: VALIDATION_TYPE,
    ) {}

    protected async _execute(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const instance = plainToInstance(
            this.classToValidate,
            req[this.validationType],
        );

        try {
            validate(instance).then((errors) => {
                if (errors.length > 0) {
                    const errorMessages: string[] =
                        this.extractErrorMessages(errors);

                    this.loggerService.debug(errors.toString());

                    next(
                        new UnprocessableEntityError({
                            message: VALIDATION_FAILED,
                            fails: errorMessages,
                            originalError: errors,
                        }),
                    );
                } else {
                    req[this.validationType] = { ...instance };
                    next();
                }
            });
        } catch (error) {
            console.error(error);
            if (error instanceof Error) this.loggerService.error(error);
            next(
                new UnprocessableEntityError({
                    message: VALIDATION_FAILED,
                    fails: [SOMETHING_GOES_WRONG],
                    originalError: error,
                }),
            );
        }
    }

    extractErrorMessages(errors: ValidationError[]): string[] {
        const errorMessages: string[] = [];

        const extractMessages = (errors: ValidationError[]): void => {
            if (!errors) return;

            for (const err of errors) {
                if (err && err.constraints) {
                    for (const message of Object.values(err.constraints)) {
                        errorMessages.push(message);
                    }
                }
                if (err && err?.children && err.children.length > 0) {
                    extractMessages(err.children);
                }
            }
        };

        extractMessages(errors);

        return errorMessages;
    }
}
