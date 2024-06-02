import * as winston from 'winston';

export const API_LOG_LEVELS = {
    CRITICAL: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 3,
    PROMPT: 4,
    DATA: 5,
    DEBUG: 6,
    TRACE: 7,
};

export const API_LOG_LEVELS_MAP = {
    [API_LOG_LEVELS.CRITICAL]: 'CRITICAL',
    [API_LOG_LEVELS.ERROR]: 'ERROR',
    [API_LOG_LEVELS.WARNING]: 'WARNING',
    [API_LOG_LEVELS.INFO]: 'INFO',
    [API_LOG_LEVELS.PROMPT]: 'PROMPT',
    [API_LOG_LEVELS.DATA]: 'DATA',
    [API_LOG_LEVELS.DEBUG]: 'DEBUG',
    [API_LOG_LEVELS.TRACE]: 'TRACE',
};

/**
 * Font styles: bold, dim, italic, underline, inverse, hidden, strikethrough.
 *
 * Font foreground colors: black, red, green, yellow, blue, magenta, cyan, white, gray, grey.
 *
 * Background colors: blackBG, redBG, greenBG, yellowBG, blueBG magentaBG, cyanBG, whiteBG
 */
export const API_LOG_COLOURS: winston.config.AbstractConfigSetColors = {
    [API_LOG_LEVELS_MAP[API_LOG_LEVELS.CRITICAL]]: 'bold red blackBG',
    [API_LOG_LEVELS_MAP[API_LOG_LEVELS.ERROR]]: 'red blackBG',
    [API_LOG_LEVELS_MAP[API_LOG_LEVELS.WARNING]]: 'underline yellow',
    [API_LOG_LEVELS_MAP[API_LOG_LEVELS.INFO]]: 'white',
    [API_LOG_LEVELS_MAP[API_LOG_LEVELS.PROMPT]]: 'cyan',
    [API_LOG_LEVELS_MAP[API_LOG_LEVELS.DATA]]: 'magenta',
    [API_LOG_LEVELS_MAP[API_LOG_LEVELS.DEBUG]]: 'green',
    [API_LOG_LEVELS_MAP[API_LOG_LEVELS.TRACE]]: 'blue',
};
