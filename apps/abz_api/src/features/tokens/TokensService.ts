import { createHash, createHmac, randomBytes } from 'node:crypto';

import { inject, injectable } from 'inversify';
import { sign, verify, Algorithm } from 'jsonwebtoken';

import { TokenEntity } from './TokenEntity';
import {
    IConfigService,
    ILogger,
    ITokenEntity,
    ITokensService,
    TAccessToken,
    TJWTPayload,
    TTokenDecoded,
} from '../../common';
import { APP_KEYS } from '../../config/appKeys';
import { ENV_VARS } from '../../constants';
import { CacheService } from '../../core/services/CacheService';


@injectable()
export class TokensService implements ITokensService {
    private readonly accessTokenSecret: string;
    private readonly accessTokenExpiresIn: string;
    private readonly algorithm: Algorithm;
    private readonly JWTCachePrefix: string;
    private readonly JWTCacheTTL: number;

    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
        @inject(APP_KEYS.CacheService) private cacheService: CacheService,
    ) {
        this.JWTCachePrefix = this.configService.get(
            ENV_VARS.API_JWT_CACHE_PREFIX,
        );
        this.JWTCacheTTL = Number(this.configService.get(
            ENV_VARS.API_JWT_CACHE_TTL,
        ));
        this.accessTokenSecret = this.configService.get(
            ENV_VARS.API_JWT_ACCESS_SECRET,
        );
        this.accessTokenExpiresIn = this.configService.get(
            ENV_VARS.API_JWT_ACCESS_EXPIRES_IN,
        );
        this.algorithm = <Algorithm>(
            this.configService.get(ENV_VARS.API_JWT_ALGORITHM)
        );
    }

    private async generateIv(): Promise<string> {
        return randomBytes(16).toString('base64');
    }

    private async generateMac(iv: string, value: string): Promise<string> {
        const hmac = createHmac('sha256', 'your-secret-key'); // Replace 'your-secret-key' with a secure key
        hmac.update(iv + value);
        return hmac.digest('hex');
    }

    private async generateValue(): Promise<string> {
        return randomBytes(64).toString('base64');
    }

    private async generatePayload(): Promise<TJWTPayload> {
        const iv = await this.generateIv();
        const value = await this.generateValue();
        const mac = await this.generateMac(iv, value);
        const exp = Math.floor(Date.now() / 1000) + this.JWTCacheTTL;
        return { iv, value, mac, exp };
    }

    private base64Encode (value: string): string {
        return Buffer.from(value).toString('base64');
    }

    private base64Decode (value: string): string {
        return Buffer.from(value, 'base64').toString('utf8');
    }

    private hashFromToken(value: string): string {
        return createHash('sha256').update(value).digest('base64');
    }

    async generateJwtToken(): Promise<string> {
        const payload = await this.generatePayload();
        const token = sign(payload, this.accessTokenSecret, { algorithm: this.algorithm });
        return this.base64Encode(token);
    }

    async verifyToken(value: string): Promise<boolean> {
        try {
            const token = this.base64Decode(value);
            const decoded = verify(token, this.accessTokenSecret) as TJWTPayload;
            const hashFromToken = this.hashFromToken(token);

            if (decoded.exp < Math.floor(Date.now() / 1000)) {
                this.loggerService.debug('Token has expired');
                return false;
            }

            const isUsed = await this.cacheService.get(`${this.JWTCachePrefix}:${hashFromToken}`);
            if (isUsed) {
                this.loggerService.debug('Token has already been used');
                return false;
            }

            await this.cacheService.set(`${this.JWTCachePrefix}:${hashFromToken}`, 'used', decoded.exp - Math.floor(Date.now() / this.JWTCacheTTL) );

            return true;
        } catch (err) {
            if(err instanceof Error) {
                this.loggerService.error(err);
            }
            return false;
        }
    }

    public generateToken(
        secret: string,
        exp: string,
    ): TAccessToken {
        const tokenEntity: ITokenEntity = new TokenEntity(secret);

        return tokenEntity.sign('', exp, this.algorithm);
    }

    public validateToken(
        token: TAccessToken,
        secret: string,
    ): TTokenDecoded {
        const tokenEntity: ITokenEntity = new TokenEntity(secret);
        return tokenEntity.verify(token);
    }

    public generateAccessToken(): TAccessToken {
        return this.generateToken(
            this.accessTokenSecret,
            this.accessTokenExpiresIn,
        );
    }

    public validateAccessToken(token: TAccessToken): TTokenDecoded {
        return this.validateToken(token, this.accessTokenSecret);
    }
}
