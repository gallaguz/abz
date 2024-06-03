import { sign, verify, SignOptions, Algorithm } from 'jsonwebtoken';

import { ITokenEntity, TAccessToken, TReqId, TTokenDecoded } from '../../common';

export class TokenEntity implements ITokenEntity {
    constructor(private readonly _secret: string) {}

    public sign(
        reqId: TReqId,
        expiresIn: string,
        algorithm: Algorithm,
    ): TAccessToken {
        try {
            const payload = { reqId };

            const options: SignOptions = {
                algorithm: algorithm,
                expiresIn: expiresIn,
            };
            return sign(payload, this._secret, options);
        } catch (error) {
            console.error(error);
            throw new Error('Sign token error');
        }
    }


    public verify(token: TAccessToken): TTokenDecoded {
        const verified: string | TTokenDecoded = <string | TTokenDecoded>(
            verify(token, this._secret, {
                clockTolerance: 5,
            })
        );

        if (typeof verified === 'string') {
            // TODO
            throw new Error(verified);
        }

        return verified;
    }
}
