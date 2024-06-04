import { Module } from '@nestjs/common';
import { AppController } from './controller';
import { ImageService } from './service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ImageService],
})
export class AppModule {}
