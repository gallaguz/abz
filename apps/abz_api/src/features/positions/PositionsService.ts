import { Prisma } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { PositionsEntity } from './PositionsEntity';
import { IPositionsService } from '../../common';
import { APP_KEYS } from '../../config/appKeys';
import { DatabaseService } from '../../core/services/DatabaseService';

@injectable()
export class PositionsService implements IPositionsService {
    
    constructor(
        @inject(APP_KEYS.DatabaseService) private databaseService: DatabaseService,
    ) {}

    public async all(): Promise<PositionsEntity[]> {
        const positions: Array<Prisma.PositionsGetPayload<{}>> = await this.databaseService.client.positions.findMany();
        if(!positions) throw new Error();
        
        return positions.map((position) => new PositionsEntity(position))
    }
}
