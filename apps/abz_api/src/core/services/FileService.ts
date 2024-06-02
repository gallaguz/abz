import axios from 'axios';
import { ensureDir, writeFile } from 'fs-extra';
import { inject, injectable } from 'inversify';
import { v4 as uuidV4 } from 'uuid';

import { FileElement, IConfigService, ILogger } from '../../common';
import { APP_KEYS } from '../../config/appKeys';
import { ENV_VARS } from '../../constants';

@injectable()
export class FilesService {
    private readonly uploadFolder: string;
    private readonly converterUPL: string;
    private readonly imageFormat: string;

    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
    ) {
        this.loggerService.debug(this.configService.get(
            ENV_VARS.API_CONVERTER_URL,
        ))
        this.uploadFolder = this.configService.get(ENV_VARS.API_UPLOAD_FOLDER_PATH);
        this.converterUPL = `http://${this.configService.get(
            ENV_VARS.API_CONVERTER_URL,
        )}`;
        this.imageFormat = this.configService.get(
            ENV_VARS.API_DEFAULT_PHOTO_FORMAT,
        );
    }

    async savePhoto(buffer: Buffer): Promise<FileElement> {
        const uploadFolder = this.uploadFolder;
        await ensureDir(uploadFolder);

        const filename = `${uuidV4()}.${this.imageFormat}`;
        await writeFile(`${uploadFolder}/${filename}`, buffer);

        return {
            path: `${uploadFolder}/${filename}`,
            name: filename,
        };
    }

    public async handlePhoto(
        file: Express.Multer.File,
    ): Promise<FileElement> {
        const { data } = await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: this.converterUPL,
            data: {
                image: file.buffer.toString('base64'),
            },
        });
        return this.savePhoto(Buffer.from(data.image, 'base64'));
    }
}
