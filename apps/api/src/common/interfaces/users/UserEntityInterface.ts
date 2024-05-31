import {  User } from '@prisma/client';

export interface IUserEntityInterface {
    id: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    position_id: string;
    photo: string;
    registration_timestamp: number;
    created_at: Date;
    updated_at: Date;
    toJSON(): Partial<User>;
}
