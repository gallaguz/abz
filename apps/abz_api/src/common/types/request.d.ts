declare namespace Express {
    export interface Request {
        file: Express.Multer.File;
        token: boolean;
        headers: {
            token: string
        };
    }
}
