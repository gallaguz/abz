import { Positions } from '@prisma/client';

export interface IPositionsEntityInterface {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    toJSON(): Partial<Positions>;
}
