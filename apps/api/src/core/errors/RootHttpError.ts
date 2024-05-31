import { CLIENT_ERROR_CODES, STATUS_CODES_MESSAGES_MAP } from '../../constants';

export type THttpErrorInput = {
    statusCode?: number;
    message?: any;
    fails?: string[];
    context?: string;
    originalError?: unknown;
};

export class RootHttpError extends Error {
    statusCode: number;
    message: string;
    fails?: string[];
    context?: string;
    originalError?: unknown;

    constructor(input?: THttpErrorInput) {
        super(
            input?.message ||
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR_CODES.BAD_REQUEST],
        );
        this.statusCode = input?.statusCode || CLIENT_ERROR_CODES.BAD_REQUEST;
        this.message =
            input?.message ||
            STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR_CODES.BAD_REQUEST];
        this.context = input?.context;
        this.fails = input?.fails;
        this.originalError = input?.originalError;
    }
}
