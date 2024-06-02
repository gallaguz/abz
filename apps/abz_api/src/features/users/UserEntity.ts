import { User } from '@prisma/client';

import {
    IConfigService,
    IUserEntityInterface,
    TUserWithPosition,
} from '../../common';
import { ENV_VARS } from '../../constants';

export class UserEntity implements IUserEntityInterface {
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

    constructor(
        {
            id,
            email,
            name,
            phone,
            photo,
            position,
            position_id,
            created_at,
            updated_at,
        }: TUserWithPosition,
        configService: IConfigService,
    ) {
        this.id = String(id);
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.photo = `${configService.get(
            ENV_VARS.API_PROTOCOL,
        )}://${configService.get(ENV_VARS.API_HOST)}/${configService.get(
            ENV_VARS.API_IMAGES_URL_PATH,
        )}/${photo}`;
        this.position = position.name;
        this.position_id = String(position_id);
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.registration_timestamp = new Date(created_at).getTime();
    }

    public toJSON(): Partial<User> {
        const exclude = <Key extends keyof User>(
            keys: string[],
        ): Omit<User, Key> => {
            return Object.fromEntries(
                Object.entries(this).filter(([key]) => !keys.includes(key)),
            ) as Omit<User, Key>;
        };

        return exclude(['created_at', 'updated_at']);
    }
}
