import * as process from 'process';

import * as dotenv from 'dotenv';
import { inject, injectable } from 'inversify';

import { APP_KEYS } from './appKeys';
import { IConfigService, ILogger } from '../common';
import { API_APP_ENV, ENV_VARS } from '../constants';

dotenv.config();

@injectable()
export class ConfigService implements IConfigService {
    public readonly appEnv: API_APP_ENV;

    constructor(@inject(APP_KEYS.LoggerService) private logger: ILogger) {
        this.appEnv = this.init();

        this.logger.info(`[ ${this.constructor.name} ] env loaded`);
    }

    private init(): API_APP_ENV {
        const appEnv: string | undefined = process.env[ENV_VARS.API_APP_ENV];

        const validEnvs = new Set<string>(Object.values(API_APP_ENV));

        if (!appEnv || !validEnvs.has(appEnv)) {
            throw new Error(`Invalid API_APP_ENV "${appEnv}"`);
        }

        return appEnv as API_APP_ENV;
    }

    public get(key: ENV_VARS): string {
        const val = process.env[key];
        if (!val) throw new Error(`Env not found: ${key}`);
        return val;
    }
}
