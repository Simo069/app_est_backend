import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CreateNiveauDto } from './dto/create-niveau.dto';
import { UpdateNiveauDto } from './dto/update-niveau.dto';
import { NiveauService } from './niveau.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('niveau')
export class NiveauController {
  constructor(private readonly niveauService: NiveauService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(201)
  async create(@Body() createNiveauDto: CreateNiveauDto) {
    return await this.niveauService.create(createNiveauDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(600000)
  @HttpCode(200)
  async findAll() {
    return await this.niveauService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    return await this.niveauService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateNiveauDto: UpdateNiveauDto,
  ) {
    return await this.niveauService.update(id, updateNiveauDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    return await this.niveauService.delete(id);
  }
}
