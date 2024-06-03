import 'reflect-metadata';
import 'dotenv/config';

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
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            loggerService.error(error);
        }
    }
}

void bootstrap();
