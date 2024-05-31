import { Positions } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

import { PositionsEntity } from '../../../features/positions/PositionsEntity';
import { ExpressReturnType } from '../BaseControllerInterface';

export interface IPositionsController {
    all(req: Request, res: Response, next: NextFunction): Promise<ExpressReturnType>
}

export interface IPositionsService {
    all(): Promise<PositionsEntity[]>
}

export * from './PositionsEntityInterface';
