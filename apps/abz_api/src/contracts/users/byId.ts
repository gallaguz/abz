import { Transform } from 'class-transformer';
import { IsOptional, Max, Min } from 'class-validator';
import express from 'express';

import { IUserEntityInterface } from '../../common';

export namespace UsersById {
    export class DTO {
        @Transform(({ value }) => {
            // if(isNaN(value)) return 1;
            return Number(value);
        })
        @Min(1, { message: 'The id must be at least 1.' })
        @Max(Number.MAX_SAFE_INTEGER, { message: 'The id must be an integer.' })
        id: number;
    }

    export type Request = express.Request & { params: { id: number } };

    export class Response {
        success: boolean;
        page: number;
        total_pages: number;
        total_users: number;
        count: number;
        links: {
            next_url: string | null;
            prev_url: string | null;
        };
        users: Array<Omit<IUserEntityInterface, 'toJSON'>>;
    }
}
