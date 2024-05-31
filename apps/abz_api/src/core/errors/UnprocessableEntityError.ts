import { RootHttpError, THttpErrorInput } from './RootHttpError';
import { CLIENT_ERROR_CODES, STATUS_CODES_MESSAGES_MAP } from '../../constants/statusCodes';

export class UnprocessableEntityError extends RootHttpError {
    constructor(input: THttpErrorInput) {
        super({
            statusCode:
                input.statusCode || CLIENT_ERROR_CODES.UNPROCESSABLE_ENTITY,
            message:
                input.message ||
                STATUS_CODES_MESSAGES_MAP[
                    CLIENT_ERROR_CODES.UNPROCESSABLE_ENTITY
                ],
            fails: input.fails,
            context: input.context,
            originalError: input.originalError,
        });
    }
}
