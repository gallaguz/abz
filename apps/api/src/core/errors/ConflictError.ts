import { RootHttpError, THttpErrorInput } from './RootHttpError';
import { CLIENT_ERROR_CODES, STATUS_CODES_MESSAGES_MAP } from '../../constants';

export class ConflictError extends RootHttpError {
    constructor(input?: THttpErrorInput) {
        super({
            statusCode: input?.statusCode || CLIENT_ERROR_CODES.CONFLICT,
            message:
                input?.message ||
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR_CODES.CONFLICT],
            context: input?.context,
            originalError: input?.originalError,
        });
    }
}
