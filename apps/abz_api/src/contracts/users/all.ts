import { Transform } from 'class-transformer';
import { IsOptional, Max, Min } from 'class-validator';
import express from 'express';

import { IUserEntityInterface } from '../../common';
import { WRONG_COUNT, WRONG_PAGE } from '../../constants';

export namespace UsersAll {
    export class DTO {
        @IsOptional()
        @Transform(({ value }) => {
            if (isNaN(value)) return false;
            return Number(value);
        })
        @Min(1, { message: WRONG_PAGE })
        @Max(Number.MAX_SAFE_INTEGER, { message: WRONG_PAGE })
        page: number;

        @Max(Number.MAX_SAFE_INTEGER, { message: WRONG_COUNT })
        @Min(0, { message: WRONG_COUNT })
        @Transform(({ value }) => {
            if (isNaN(value)) return false;
            return Number(value);
        })
        @IsOptional()
        count: number;
    }

    export type Request = express.Request & {
        query: { count?: number; page?: number };
    };

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
