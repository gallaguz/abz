import { Algorithm } from 'jsonwebtoken';

import { TAccessToken, TReqId, TTokenDecoded } from '../../types/TokenEntityTypes';

export interface ITokenEntity {
    sign(
        reqId: TReqId,
        expiresIn: string,
        algorithm: Algorithm,
    ): TAccessToken;
    verify(token: TAccessToken): TTokenDecoded;
}
