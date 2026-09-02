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
import { FiliereService } from './filiere.service';
import { CreateFiliereDto } from './dto/create-filiere.dto';
import { UpdateFiliereDto } from './dto/update-filiere.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('filiere')
export class FiliereController {
    constructor(private readonly filiereService : FiliereService ){}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @HttpCode(201)
    create(@Body() createFiliereDto : CreateFiliereDto){
        return this.filiereService.create(createFiliereDto);
    }

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(600000)
    @HttpCode(200)
    findAll(){
        return this.filiereService.findAll();
    }

    @Get('niveau/:niveauId')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(600000)
    @HttpCode(200)
    findByNiveau(@Param('niveauId') niveauId : string){
        return this.filiereService.findByNiveauId(niveauId);
    }

    @Get(':id')
    @HttpCode(200)
    findOne(@Param('id') id : string){
        return this.filiereService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    update(@Param('id') id : string , @Body() updateFiliereDto: UpdateFiliereDto){
        return this.filiereService.update(id, updateFiliereDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id : string){
        return this.filiereService.remove(id);
    }
}
