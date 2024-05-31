export type TJWTPayload = {
    iv: string;
    value: string;
    mac: string;
    exp: number;
    // jti: string;
}

