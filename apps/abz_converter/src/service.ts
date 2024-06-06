import { Injectable } from '@nestjs/common';

import * as sharp from 'sharp';
import { Metadata, Sharp } from 'sharp';

export type TDefaults = {
  height: number;
  width: number;
  quality: number;
  format: string;
};

@Injectable()
export class ImageService {
  async crop(image: string): Promise<Buffer> {
    try {
      const defaults = this.getDefaults();

      const { container } = await this.parseImage(
        Buffer.from(image, 'base64'),
        defaults,
      );

      return container
        .resize({
          width: Math.round(defaults.width),
          height: Math.round(defaults.height),
          fit: 'cover',
          position: 'centre',
        })
        .jpeg({ quality: defaults.quality })
        .toBuffer();
    } catch (error) {
      if (error instanceof Error) console.error(error.message);

      throw error;
    }
  }

  private getDefaults(): TDefaults {
    return {
      height: Number(process.env.CONVERTER_DEFAULT_PHOTO_HEIGHT),
      width: Number(process.env.CONVERTER_DEFAULT_PHOTO_WIDTH),
      quality: Number(process.env.CONVERTER_DEFAULT_PHOTO_QUALITY),
      format: process.env.CONVERTER_DEFAULT_PHOTO_FORMAT,
    };
  }

  private async parseImage(
    image: Buffer,
    defaults: TDefaults,
  ): Promise<{ container: Sharp; metadata: Metadata }> {
    try {
      const container: Sharp = sharp(image);
      const metadata = await this.getMetadata(container);

      this.checkImage(metadata, defaults);

      return { container, metadata };
    } catch (error) {
      if (error instanceof Error) console.error(error.message);

      throw error;
    }
  }

  private async getMetadata(container: Sharp): Promise<Metadata> {
    let metadata: Metadata;
    try {
      metadata = await container.metadata();
    } catch (error) {
      if (error instanceof Error) console.error(error.message);

      throw error;
    }

    return metadata;
  }

  private checkImage(metadata: Metadata, defaults: TDefaults): void {
    if (metadata.format && !metadata.format.includes(defaults.format)) {
      throw new Error('Unsupported image format');
    }

    if (!metadata.height || !metadata.width) {
      throw new Error('Broken image');
    }

    if (metadata.height < defaults.height || metadata.width < defaults.width) {
      throw new Error('Unsupported image resolution');
    }
  }
}
