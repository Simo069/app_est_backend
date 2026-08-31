/* eslint-disable prettier/prettier */
import {
  Controller, Post, Get, Delete, Param, Query, Body,
  UseInterceptors, UploadedFile, UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';


import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ResourceType } from '@prisma/client';
import { RessourcesService } from './ressources.service';


@Controller('ressources')
export class RessourcesController {
    constructor(private ressourcesService : RessourcesService){}

    @Post('upload')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('DELEGATE', 'ADMIN') // seuls délégués/admin uploadent
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: { title: string; type: ResourceType; moduleId: string },
        @CurrentUser() user: { id: string },
    ){
        return this.ressourcesService.uploadRessource(file, dto, user.id);
    }

    @Get('module/:moduleId')
    findByModule(
        @Param('moduleId') moduleId : string,
        @Query('type') type?: ResourceType
    ){
        return this.ressourcesService.findByModuleAndType(moduleId , type);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('DELEGATE', 'ADMIN')
    findAll() {
        return this.ressourcesService.findAll();
    }

    @Get(':id/download')
    getDownloadUrl(@Param('id') id : string){
        return this.ressourcesService.getDownloadUrl(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('DELEGATE', 'ADMIN')
    deleteRessource(@Param('id') id: string) {
        return this.ressourcesService.deleteRessource(id);
    }
}
