import { Module } from '@nestjs/common';
import { FiliereService } from './filiere.service';

import { FiliereController } from './filiere.controller';
import { DatabaseModule } from 'src/database/database.module';
@Module({
  imports: [DatabaseModule],
  providers: [FiliereService],
  controllers: [FiliereController],
  exports: [FiliereService],
})
export class FiliereModule {}
