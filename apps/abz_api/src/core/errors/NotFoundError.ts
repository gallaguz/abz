import { RootHttpError, THttpErrorInput } from './RootHttpError';
import { CLIENT_ERROR_CODES, STATUS_CODES_MESSAGES_MAP } from '../../constants/statusCodes';

export class NotFoundError extends RootHttpError {
    constructor(input?: THttpErrorInput) {
        super({
            statusCode: input?.statusCode || CLIENT_ERROR_CODES.NOT_FOUND,
            message:
                input?.message ||
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR_CODES.NOT_FOUND],
            context: input?.context,
            originalError: input?.originalError,
            fails: input?.fails,
        });
    }
}
