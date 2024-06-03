import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';


import { IConfigService, ILogger } from '../../common';
import { APP_KEYS } from '../../config/appKeys';
import { ENV_VARS } from '../../constants';

@injectable()
export class CacheService {
    client: Redis;

    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
    ) {

        this.client = new Redis({
            port: Number(this.configService.get(ENV_VARS.API_REDIS_PORT)),
            host: this.configService.get(ENV_VARS.API_REDIS_HOST),
            db: Number(this.configService.get(ENV_VARS.API_REDIS_DB)),
        });
    }

    async connect(): Promise<void> {
        try {
            this.loggerService.info(`[ Redis ] Connected`);

            this.client.on('error', (error) => {
                this.loggerService.error(error.message);
            });
        } catch (error) {
            console.error(error);
            if (error instanceof Error) this.loggerService.error(error.message);
        }
    }

    async disconnect(): Promise<void> {
        this.client.disconnect();
        this.loggerService.error(`[ Redis ] disconnect`);
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttl: number): Promise<any> {
        return this.client.set(key, value, 'EX', ttl);
    }

    async remove(key: string): Promise<any> {
        return this.client.unlink(key);
    }

    async findByMatch(match: string): Promise<string[]> {
        return this.client.keys(match);
    }

    async removeByMatch(match: string): Promise<number> {
        return new Promise((resolve, reject) => {
            try {
                let totalDeleted = 0;
                const stream = this.client.scanStream({ match });

                stream.on('data', (keys: string[]) => {
                    if (keys.length) {
                        this.client.unlink(keys)
                            .then((deleted) => {
                                totalDeleted += deleted;
                                this.loggerService.info(`[ Redis ] Deleted ${deleted} keys`);
                            })
                            .catch((error) => {
                                this.loggerService.error(`[ Redis ] Error deleting keys: ${error.message}`);
                                stream.destroy(error);
                            });
                    }
                });

                stream.on('end', () => {
                    this.loggerService.info(`[ Redis ] Scan completed, total deleted keys: ${totalDeleted}`);
                    resolve(totalDeleted);
                });

                stream.on('error', (error) => {
                    this.loggerService.error(`[ Redis ] Scan error: ${error.message}`);
                    reject(error);
                });
            } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    this.loggerService.error(`[ Redis ] Exception: ${error.message}`);
                    reject(error);
                }
            }
        });
    }
}
