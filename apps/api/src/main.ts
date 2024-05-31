import 'reflect-metadata';

import process from 'process';

import { Container } from 'inversify';

import { App } from './app';
import { ILogger } from './common';
import { APP_KEYS } from './config/appKeys';
import { ROOT_CONTAINER } from './inversify/container';

async function bootstrap(): Promise<void> {
    const appContainer: Container = new Container();
    appContainer.load(ROOT_CONTAINER);

    const app: App = appContainer.get<App>(APP_KEYS.Application);
    const loggerService: ILogger = appContainer.get<ILogger>(
        APP_KEYS.LoggerService,
    );

    try {
        await app.init();

        process.on('SIGTERM', () => {
            app.close();
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            loggerService.error(error);
        }
    } finally {
        loggerService.debug(`[ PID ] ${process.pid}`);
    }
}

void bootstrap();
