import { Module } from '@nestjs/common';
import { NiveauService } from './niveau.service';
import { DatabaseModule } from '../database/database.module';
import { NiveauController } from './niveau.controller';

@Module({
  imports: [DatabaseModule],
  providers: [NiveauService],
  controllers: [NiveauController],
  exports: [NiveauService],
})
export class NiveauModule {}
