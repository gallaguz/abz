import { Transform } from 'class-transformer';
import { IsEmail,IsNumber, IsString, Max, MaxLength, MinLength } from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { IUserEntityInterface } from '../../common';
import {
    LONG_NAME,
    SHORT_NAME,
    WRONG_EMAIL,
    WRONG_NAME,
    WRONG_PHONE,
    WRONG_PHOTO_SIZE,
    WRONG_POSITION_ID,
    ENV_VARS, SHORT_EMAIL, LONG_EMAIL,
} from '../../constants';

const validCountries = ['UA'];

export namespace UsersRegister {
    export class Photo {
        fieldname: string;
        originalname: string;
        encoding: string;

        @IsString({ message: 'Invalid file type' })
        @Transform(({ value }) => {
            // console.log('--- mimetype ---', value);
            // if (value !== "jpeg/jpg") return false;
            return value;
        })
        mimetype: string;

        destination: string;
        filename: string;
        path: string;

        @Max(5242880,  { message: WRONG_PHOTO_SIZE })
        @IsNumber()
        size: number;

        buffer: Buffer;
    }

    export class DTO {
        @MinLength(2, { message: SHORT_NAME })
        @MaxLength(60, { message: LONG_NAME })
        @IsString({ message: WRONG_NAME })
        name: string;

        @MinLength(6, { message: SHORT_EMAIL })
        @MaxLength(100, { message: LONG_EMAIL })
        @IsEmail({}, { message: WRONG_EMAIL })
        email: string;

        @Transform(
            ({ value }: any) => {
                if (typeof value !== 'string') return undefined;

                const parsed = parsePhoneNumberFromString(value);

                if (!parsed) return undefined;
                if (parsed.country && !validCountries.includes(parsed.country)) return undefined;

                return parsed.number;
            },
            { toClassOnly: true },
        )
        @IsString({ message: WRONG_PHONE })
        phone: string;

        @IsNumber({ }, { message: WRONG_POSITION_ID })
        @Transform(({ value }) => {
            // console.log('position_id', value);
            if(isNaN(value)) return false;
            return Number(value);
        })
        position_id: number;
    }

    export class Response {
        success: boolean;
        page: number;
        total_pages: number;
        total_users: number;
        count: number;
        links: {
            next_url: string | null,
            prev_url: string | null,
        };
        users: Array<Omit<IUserEntityInterface, 'toJSON'>>;
    }

}
