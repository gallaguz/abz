import { RootHttpError } from './RootHttpError';
import { STATUS_CODES_MESSAGES_MAP, SUCCESS_CODES } from '../../constants';

export class NotModifiedError extends RootHttpError {
    constructor() {
        super({
            message: STATUS_CODES_MESSAGES_MAP[SUCCESS_CODES.NOT_MODIFIED],
            statusCode: SUCCESS_CODES.NOT_MODIFIED
        });
    }
}
