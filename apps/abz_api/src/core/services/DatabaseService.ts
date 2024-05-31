import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { ILogger } from '../../common';
import { APP_KEYS } from '../../config/appKeys';

@injectable()
export class DatabaseService {
    client: PrismaClient;

    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
    ) {
        this.client = new PrismaClient();
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.loggerService.info(`[ DB ] Connected`);
        } catch (error) {
            if (error instanceof Error) this.loggerService.error(error.message);
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
        this.loggerService.error(`disconnect`);
    }
}
