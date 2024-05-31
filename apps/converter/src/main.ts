import { NestFactory } from '@nestjs/core';
import { AppModule } from './module';
import * as process from 'process';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const maxPhotoSize =
    `${(Number(process.env.MAX_PHOTO_SIZE) * 1.4) / (1024 * 1024)}mb` || '6mb';
  app.use(json({ limit: maxPhotoSize }));
  app.use(urlencoded({ extended: true, limit: maxPhotoSize }));
  await app.listen(Number(process.env.CONVERTER_PORT) || 3000);
}

void bootstrap();
