import { API_APP_ENV, ENV_VARS } from '../../constants';

export interface IConfigService {
    appEnv: API_APP_ENV;
    get(key: ENV_VARS): string;
}
