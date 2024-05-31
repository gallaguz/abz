import { Body, Controller, Post } from '@nestjs/common';
import { ImageService } from './service';

import { GenerateImage } from './contracts';

@Controller()
export class AppController {
    constructor(private readonly generateService: ImageService) {}

    @Post('/')
    async cropImageCenter(
        @Body() { image }: GenerateImage.Request,
    ): Promise<GenerateImage.Response> {
        try {
            const imageBuffer = await this.generateService.crop(image);
            return { image: imageBuffer.toString('base64') };
        } catch (error) {
            if (error instanceof Error) console.error(error.message);

            throw error;
        }
    }
}
