import {
  Controller, Get, Post, Body, Param, Patch, Delete, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
    constructor(private usersService : UsersService){}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    create(@Body() user : CreateUserDto){
        return this.usersService.create(user);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    findAll(){
        return this.usersService.findAll();
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@CurrentUser() user : {id:string}){
        return this.usersService.findOne(user.id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    findOne(@Param('id') id : string){
        return this.usersService.findOne(id);
    }

    @Patch('me')
    @UseGuards(JwtAuthGuard)
    updateMe(@CurrentUser() user : {id:string} , @Body() updateUserDto : UpdateUserDto){
        return this.usersService.update(user.id , updateUserDto);
    }
    
    @Patch(':id/role')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    changeRole(@Param('id') id : string , @Body('role') role : 'STUDENT' | 'DELEGATE' | 'ADMIN'){
        return this.usersService.changeRole(id , role);
    }
    
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    remove(@Param('id') id : string){
        return this.usersService.remove(id);
    }
}
