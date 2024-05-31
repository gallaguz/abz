export enum APP_ENV {
    LOCAL = 'local',
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
    TESTING = 'testing',
    LOAD_TESTING = 'load_testing',
}

// export type TAppEnv = 'local' | 'development' | 'staging' | 'production' | 'testing' | 'load_testing';
// type TValues = TAppEnv;
//
// type Keys = keyof typeof APP_ENV;
// type Values = typeof APP_ENV[Keys];
//
// const test: TValues = 'local'; // This will work
//
// console.log(test);
//
// type TEnvName = keyof typeof APP_ENV;

export const APP_ENV_MAP = {
    local: APP_ENV.LOCAL,
    development: APP_ENV.DEVELOPMENT,
    staging: APP_ENV.STAGING,
    production: APP_ENV.PRODUCTION,
    testing: APP_ENV.TESTING,
    load_testing: APP_ENV.LOAD_TESTING
}

export enum ENV_VARS {
    IS_TERMINATED = 'IS_TERMINATED',
    APP_ENV = 'APP_ENV',
    LOG_LEVEL = 'LOG_LEVEL',
    API_PORT = 'API_PORT',
    API_HOST = 'API_HOST',
    DATABASE_URL = 'DATABASE_URL',
    SALT = 'SALT',
    JWT_ACCESS_SECRET = 'JWT_ACCESS_SECRET',
    JWT_ACCESS_EXPIRES_IN = 'JWT_ACCESS_EXPIRES_IN',
    JWT_ALGORITHM = 'JWT_ALGORITHM',
    CONVERTER_URL = 'CONVERTER_URL',
    UPLOAD_FOLDER = 'UPLOAD_FOLDER',
    UPLOAD_FOLDER_PATH = 'UPLOAD_FOLDER_PATH',
    IMAGES_URL_PATH = 'IMAGES_URL_PATH',
    API_PROTOCOL = 'API_PROTOCOL',
    JWT_CACHE_PREFIX = 'JWT_CACHE_PREFIX',
    JWT_CACHE_TTL = 'JWT_CACHE_TTL',
    DEFAULT_PAGE_COUNT_ROWS = 'DEFAULT_PAGE_COUNT_ROWS',
    MAX_PHOTO_SIZE = 'MAX_PHOTO_SIZE',
    MIN_PHOTO_HEIGHT = 'MIN_PHOTO_HEIGHT',
    MIN_PHOTO_WIDTH = 'MIN_PHOTO_WIDTH',
    DEFAULT_PHOTO_HEIGHT = 'DEFAULT_PHOTO_HEIGHT',
    DEFAULT_PHOTO_WIDTH = 'DEFAULT_PHOTO_WIDTH',
    DEFAULT_PHOTO_QUALITY = 'DEFAULT_PHOTO_QUALITY',
    DEFAULT_PHOTO_FORMAT = 'DEFAULT_PHOTO_FORMAT',
    REDIS_DB ='REDIS_DB',
    REDIS_PORT ='REDIS_PORT',
    REDIS_HOST ='REDIS_HOST',
    REDIS_CACHE_TTL = 'REDIS_CACHE_TTL'
}
