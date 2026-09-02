import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateSemestreDto } from './dto/create-semestre.dto';
import { UpdateSemestreDto } from './dto/update-semestre.dto';
import { SemestreService } from './semestre.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('semestre')
export class SemestreController {
    constructor(private readonly semestreService : SemestreService){}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @HttpCode(201)
    create(@Body() createSemestreDto : CreateSemestreDto){
        return this.semestreService.create(createSemestreDto);
    }

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(600000)
    @HttpCode(200)
    findAll(){
        return this.semestreService.findAll();
    }
    
    @Get('filiere/:filiereId')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(600000)
    @HttpCode(200)
    findByFiliereId(@Param('filiereId') filiereId : string){
        return this.semestreService.findByFiliereId(filiereId);
    }

    @Get(':id')
    @HttpCode(200)
    findOne(@Param('id') id : string){
        return this.semestreService.findOne(id);
    }
    
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @HttpCode(200)
    update(@Param('id') id : string, @Body() updateSemestreDto : UpdateSemestreDto){
        return this.semestreService.update(id, updateSemestreDto);
    }
    
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id : string){
        return this.semestreService.remove(id);
    }
}
