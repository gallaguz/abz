import { JwtPayload } from 'jsonwebtoken';

export type TReqId = string;

export type TTokenDecoded = {
    reqId: TReqId;
    exp: number;
} & JwtPayload;

export type TAccessToken = string;
