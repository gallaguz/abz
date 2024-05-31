import 'reflect-metadata';
import { Response, Router } from 'express';
import { injectable } from 'inversify';

import { TStatusCodes } from '../../constants';
import { ExpressReturnType, IBaseController, IConfigService, ILogger, IRouteInterface } from '../interfaces';

@injectable()
export abstract class BaseController implements IBaseController {
    private readonly _router: Router;

    constructor(
        public loggerService: ILogger,
        public path: string
    ) {
        this._router = Router();
    }

    get router(): Router {
        return this._router;
    }

    public sendJSON<TBody>(res: Response, code: TStatusCodes, body: TBody  ): ExpressReturnType {
        res.type('application/json');
        return res.status(code).json(body);
    }

    public success<TBody>(res: Response, code: TStatusCodes, body: TBody): ExpressReturnType {
        return this.sendJSON<TBody>(
            res,
            code,
            { success: true, ...body }
        );
    }

    public fail<TBody>(res: Response, code: TStatusCodes, body: TBody): ExpressReturnType {
        return this.sendJSON<TBody>(
            res,
            code,
            { success: false, ...body },
        );
    }

    protected bindRoutes(routes: IRouteInterface[]): void {
        this.loggerService.info(`[ Routes Binding ] ${this.constructor.name}:`);

        for (const route of routes) {
            this.loggerService.info(
                ` - [ ${route.method.toUpperCase()} ] ${route.path}`,
            );

            const middleware = route.middlewares?.map((m) => m.execute.bind(m));
            const handler = route.handler.bind(this);
            const pipeline = middleware ? [...middleware, handler] : handler;

            this.router[route.method](route.path, pipeline);
        }
    }
}
