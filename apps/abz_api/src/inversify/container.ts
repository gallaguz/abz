import { ContainerModule, interfaces } from 'inversify';

import { App } from '../app';
import {
    IConfigService,
    IExceptionFilter,
    ILogger, IPositionsController, IPositionsService, ITokensControllerInterface, ITokensService,
    IUsersController,
    IUsersService,
} from '../common';
import { APP_KEYS } from '../config/appKeys';
import { ConfigService } from '../config/ConfigService';
import { ExceptionFilter } from '../core/filters/ExceptionFilter';
import { CacheService } from '../core/services/CacheService';
import { DatabaseService } from '../core/services/DatabaseService';
import { FilesService } from '../core/services/FileService';
import { LoggerService } from '../core/services/LoggerService';
import { PositionsController } from '../features/positions/PositionsController';
import { PositionsService } from '../features/positions/PositionsService';
import { TokensController } from '../features/tokens/TokensController';
import { TokensService } from '../features/tokens/TokensService';
import { UsersController } from '../features/users/UsersController';
import { UsersService } from '../features/users/UsersService';

const ROOT_CONTAINER = new ContainerModule((bind: interfaces.Bind) => {
    // LOGGER
    bind<ILogger>(APP_KEYS.LoggerService).to(LoggerService).inSingletonScope();

    // CONFIG
    bind<IConfigService>(APP_KEYS.ConfigService)
        .to(ConfigService)
        .inSingletonScope();

    // FILTERS
    bind<IExceptionFilter>(APP_KEYS.ExceptionFilter)
        .to(ExceptionFilter)
        .inSingletonScope();

    // PRISMA
    bind<DatabaseService>(APP_KEYS.DatabaseService)
        .to(DatabaseService)
        .inSingletonScope();
    
    // Redis
    bind<CacheService>(APP_KEYS.CacheService)
        .to(CacheService)
        .inSingletonScope();

    // USERS
    bind<IUsersController>(APP_KEYS.UserController).to(UsersController);
    bind<IUsersService>(APP_KEYS.UsersService).to(UsersService);

    // FILES
    bind<FilesService>(APP_KEYS.FilesService).to(FilesService);

    // TOKENS
    bind<ITokensControllerInterface>(APP_KEYS.TokensController).to(TokensController);
    bind<ITokensService>(APP_KEYS.TokensService).to(TokensService);

    // POSITIONS
    bind<IPositionsController>(APP_KEYS.PositionsController).to(PositionsController);
    bind<IPositionsService>(APP_KEYS.PositionsService).to(PositionsService);

    // APP
    bind<App>(APP_KEYS.Application).to(App).inSingletonScope();
});

export { ROOT_CONTAINER };
