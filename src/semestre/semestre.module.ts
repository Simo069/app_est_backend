import { Module } from '@nestjs/common';
import { SemestreService } from './semestre.service';
import { DatabaseModule } from 'src/database/database.module';
import { SemestreController } from './semestre.controller';

@Module({
  imports: [DatabaseModule],
  providers: [SemestreService],
  controllers: [SemestreController],
  exports: [SemestreService],
})
export class SemestreModule {}
