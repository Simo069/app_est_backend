import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';

@Module({
  exports: [MinioService],
  controllers: [MinioController],
  providers: [MinioService],
})
export class MinioModule {}
