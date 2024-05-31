import { TAccessToken, TTokenDecoded } from '../../types/TokenEntityTypes';

export interface ITokensService {
    generateJwtToken(): Promise<string>;
    verifyToken(token: string): Promise<boolean>

    generateAccessToken(): string;
    validateAccessToken(token: TAccessToken): TTokenDecoded;
}
