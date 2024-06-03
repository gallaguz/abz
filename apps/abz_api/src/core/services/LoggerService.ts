import * as process from 'process';
import * as util from 'util';

import { injectable } from 'inversify';
import * as winston from 'winston';

import { ILogger } from '../../common';
import { ENV_VARS, API_LOG_COLOURS, API_LOG_LEVELS, API_LOG_LEVELS_MAP } from '../../constants';

winston.addColors(API_LOG_COLOURS);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
    winston.format((info) => {
        if (info && info.message && typeof info.message === 'object') {
            info.message = JSON.stringify(info.message, null, 2);
        }
        return info;
    })(),
);

const transports: Array<any> = [
    new winston.transports.Console(
        { level: process.env[ENV_VARS.API_LOG_LEVEL] || API_LOG_LEVELS_MAP[API_LOG_LEVELS.TRACE]}
    ),
];

@injectable()
export class LoggerService implements ILogger {
    private readonly _instance: winston.Logger;
    constructor() {
        this._instance = winston.createLogger({
            // level: process.env[ENV_VARS.API_LOG_LEVEL] || API_LOG_LEVELS_MAP[API_LOG_LEVELS.ERROR],
            levels: API_LOG_LEVELS,
            format,
            transports,
        });
    }

    public critical(message: string | number | object): void {
        this._instance.log({
            level: API_LOG_LEVELS_MAP[API_LOG_LEVELS.CRITICAL],
            message: `[ p:${process.pid} ]` + this.formatMessage(message),
        });
    }

    public debug(message: string | number | object): void {
        this._instance.log({
            level: API_LOG_LEVELS_MAP[API_LOG_LEVELS.DEBUG],
            message: `[ p:${process.pid} ]` + this.formatMessage(message),
        });
    }

    public error(message: string | number | object): void {
        this._instance.log({
            level: API_LOG_LEVELS_MAP[API_LOG_LEVELS.ERROR],
            message: `[ p:${process.pid} ] ` + this.formatMessage(message),
        });
    }

    public info(message: string | number | object): void {
        this._instance.log({
            level: API_LOG_LEVELS_MAP[API_LOG_LEVELS.INFO],
            message: `[ p:${process.pid} ] ` + this.formatMessage(message),
        });
    }

    public prompt(message: string | number | object): void {
        this._instance.log({
            level: API_LOG_LEVELS_MAP[API_LOG_LEVELS.PROMPT],
            message: `[ p:${process.pid} ] ` + this.formatMessage(message),
        });
    }

    public data(message: string | number | object): void {
        this._instance.log({
            level: API_LOG_LEVELS_MAP[API_LOG_LEVELS.DATA],
            message: `[ p:${process.pid} ] ` + this.formatMessage(message),
        });
    }

    public warning(message: string | number | object): void {
        this._instance.log({
            level: API_LOG_LEVELS_MAP[API_LOG_LEVELS.WARNING],
            message: `[ p:${process.pid} ] ` + this.formatMessage(message),
        });
    }

    public trace(message: string | number | object): void {
        this._instance.log({
            level: API_LOG_LEVELS_MAP[API_LOG_LEVELS.TRACE],
            message: `[ p:${process.pid} ] ` + this.formatMessage(message),
        });
    }

    public morgan(message: string): void {
        this._instance.log({
            level: API_LOG_LEVELS_MAP[API_LOG_LEVELS.ERROR],
            message: `[ p:${process.pid} ] ` + this.formatMessage(message),
        });
    }

    private formatMessage(message: string | number | object): string {
        return typeof message === 'object'
            ? util.inspect(message, { depth: 4 })
            : message.toString();
    }
}
