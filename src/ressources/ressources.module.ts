import { Module } from '@nestjs/common';
import { RessourcesService } from './ressources.service';
import { RessourcesController } from './ressources.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MinioModule } from 'src/minio/minio.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, MinioModule, AuthModule],
  providers: [RessourcesService],
  exports: [RessourcesService],
  controllers: [RessourcesController],
})
export class RessourcesModule {}
