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
import { ModulesService } from './modules.service';
import { CreateModulesDto } from './dto/create-modules.dto';
import { UpdateModulesDto } from './dto/update-modules.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('modules')
export class ModulesController {
    constructor(private readonly modulesService : ModulesService){}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'DELEGATE')
    @HttpCode(201)
    create(@Body() createModulesDto : CreateModulesDto){
        return this.modulesService.create(createModulesDto);
    }

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(300000)
    @HttpCode(200)
    findAll(){
        return this.modulesService.findAll();
    }

    @Get('semestre/:semestreId')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(300000)
    @HttpCode(200)
    findBySemestreId(@Param('semestreId') semestreId : string){
        return this.modulesService.findbySemestreId(semestreId);
    }

    @Get(':id')
    @HttpCode(200)
    findOne(@Param('id') id : string){
        return this.modulesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'DELEGATE')
    @HttpCode(200)
    update(@Param('id') id : string , @Body() updateModulesDto : UpdateModulesDto){
        return this.modulesService.update(id , updateModulesDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id : string){
        return this.modulesService.remove(id);
    }
}
