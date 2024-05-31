import { Positions, User } from '@prisma/client';

import {  IPositionsEntityInterface } from '../../common';

export class PositionsEntity implements IPositionsEntityInterface {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;

    constructor(
        { id, name, created_at, updated_at }: Positions,
    ) {
        this.id = String(id);
        this.name = name;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    public toJSON(): Partial<User> {
        const exclude = <Key extends keyof User>(keys: string[]): Omit<User, Key> => {
            return Object.fromEntries(
                Object.entries(this).filter(([key]) => !keys.includes(key)),
            ) as Omit<User, Key>;
        }

        return exclude(['created_at', 'updated_at']);
    }
}
