import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { DatabaseModule } from 'src/database/database.module';
import { ModulesController } from './modules.controller';

@Module({
  imports: [DatabaseModule],
  providers: [ModulesService],
  controllers: [ModulesController],
  exports: [ModulesService],
})
export class ModulesModule {}
