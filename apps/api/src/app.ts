import 'reflect-metadata';
import { Server } from 'http';
import process from 'process';

import { json, urlencoded } from 'body-parser';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import morgan from 'morgan';

import {
    IConfigService,
    IExceptionFilter,
    ILogger,
    IUsersController,
} from './common';
import { APP_KEYS } from './config/appKeys';
import { ENV_VARS } from './constants';
import { CacheService } from './core/services/CacheService';
import { DatabaseService } from './core/services/DatabaseService';
import { PositionsController } from './features/positions/PositionsController';
import { TokensController } from './features/tokens/TokensController';

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;

    constructor(
        @inject(APP_KEYS.UserController)
        private userController: IUsersController,
        @inject(APP_KEYS.TokensController)
        private tokensController: TokensController,
        @inject(APP_KEYS.PositionsController)
        private positionsController: PositionsController,
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
        @inject(APP_KEYS.ExceptionFilter)
        private exceptionFilter: IExceptionFilter,
        @inject(APP_KEYS.DatabaseService)
        private databaseService: DatabaseService,
        @inject(APP_KEYS.CacheService) private cacheService: CacheService,
    ) {
        this.app = express();
        this.port = Number(this.configService.get(ENV_VARS.API_PORT));
    }

    useMiddleware(): void {
        const maxPhotoSize =
            `${(Number(this.configService.get(ENV_VARS.MAX_PHOTO_SIZE)) * 1.4) / (1024 * 1024)}mb` ||
            '6mb';
        this.app.use(json({ limit: maxPhotoSize }));
        this.app.use(urlencoded({ extended: true, limit: maxPhotoSize }));

        this.app.use(
            morgan('dev', {
                stream: {
                    write: (message) => {
                        process.stdout.write(message);
                    },
                },
            }),
        );
    }

    useRoutes(): void {
        this.app.use(
            '/api/v1' + this.userController.path,
            this.userController.router,
            this.exceptionFilter.catch.bind(this.exceptionFilter),
        );
        this.app.use(
            '/api/v1' + this.tokensController.path,
            this.tokensController.router,
            this.exceptionFilter.catch.bind(this.exceptionFilter),
        );
        this.app.use(
            '/api/v1' + this.positionsController.path,
            this.positionsController.router,
            this.exceptionFilter.catch.bind(this.exceptionFilter),
        );
    }

    public async init(): Promise<void> {
        if (!this.isTerminated()) {
            this.server = this.app.listen(this.port);

            await this.databaseService.connect();
            await this.cacheService.connect();

            this.useMiddleware();
            this.useRoutes();

            this.loggerService.info(
                `[ ${this.constructor.name} ] Listening on port: ${this.port}`,
            );
            this.loggerService.info(
                `[ ${
                    this.constructor.name
                } ] DATABASE_URL: ${this.configService.get(
                    ENV_VARS.DATABASE_URL,
                )}`,
            );
        } else {
            process.exit(0);
        }
    }

    public isTerminated(): boolean {
        return parseInt(this.configService.get(ENV_VARS.IS_TERMINATED)) === 1;
    }

    public async close(): Promise<void> {
        process.env.IS_TERMINATED = String(1);
        this.loggerService.warning(
            'Shutting down the application gracefully...',
        );
        await this.sleep(30_000);
        this.server.close();
        this.loggerService.warning('Server stopped. Application terminated.');
        process.exit(0);
    }

    public sleep(milliseconds: number): Promise<void> {
        return new Promise((resolve): void => {
            setTimeout((): void => {
                resolve();
            }, milliseconds);
        });
    }
}
