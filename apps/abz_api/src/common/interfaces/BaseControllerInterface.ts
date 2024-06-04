import { NextFunction, Request, Response, Router } from 'express';

import { IMiddleware } from './MiddlewareInterface';
import { TStatusCodes } from '../../constants';

type THttpMethods = 'get' | 'post' | 'delete' | 'patch' | 'put' | 'options';

export interface IRouteInterface {
    path: string;
    handler(req: Request, res: Response, next: NextFunction): void;
    method: keyof Pick<Router, THttpMethods>;
    middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;

export interface IBaseController {
    path: string;
    router: Router;
    success<TBody>(res: Response, code: TStatusCodes, body: TBody): ExpressReturnType;
    fail<TBody>(res: Response, code: TStatusCodes, body: TBody): ExpressReturnType;
}
