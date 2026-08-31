/* eslint-disable prettier/prettier */
import { DatabaseService } from '../database/database.service';
import { CreateModulesDto } from './dto/create-modules.dto';
import { UpdateModulesDto } from './dto/update-modules.dto';

import { Injectable, 
    NotFoundException, 
} from '@nestjs/common';



@Injectable()
export class ModulesService {
    constructor(private readonly databaseService: DatabaseService){};

    // Créer un module
    async create(createModulesDto : CreateModulesDto){
        const {name , code , semestreId} = createModulesDto;

        const semestre = await this.databaseService.semestre.findUnique({
            where: {
                id: semestreId,
            },
        });
        if(!semestre){
            throw new NotFoundException(`Le semestre avec l'id ${semestreId} n'existe pas`);
        }
        return this.databaseService.module.create({
            data : {
                name,
                code ,
                semestreId
            },
            include: {
                semestre: true,
            }
        });
    }

    // Récupérer tous les modules
    async findAll(){
        return this.databaseService.module.findMany({
            include :{
                semestre : true,
            },
            orderBy: {
                createdAt : 'desc'
            }
        });
    }

    // Récupérer un module par ID
    async findOne(id : string){
        const module = await this.databaseService.module.findUnique({
            where: {
                id,
            },
            include : {
                semestre: true 
            },
        });
        if(!module){
            throw new NotFoundException(
                `Le module avec l'id ${id} n'existe pas`,
            );
        }
        return module;
    }

    // Récupérer les modules d'un semestre

    async findbySemestreId(semestreId : string){
        const semestre = await this.databaseService.semestre.findUnique({
            where : {
                id : semestreId
            },
        });
        if(!semestre){
            throw new NotFoundException(
                `Le semestre avec l'id ${semestreId} n'existe pas`,
            );
        }
        return this.databaseService.module.findMany({
            where : {
                semestreId
            },
            include: {
                semestre: true,
                resources: true,
                _count: {
                    select: { resources: true }
                }
            },
            orderBy:{
                name : 'asc'
            }
        });
    }

    // Modifier un module 

    async update(id: string , updateModulesDto : UpdateModulesDto){
        await this.findOne(id);
        
        const {name , code , semestreId}= updateModulesDto;
        if(semestreId){
            const semestre = await this.databaseService.semestre.findUnique({
                where: {
                    id : semestreId,
                },
            });
            if(!semestre){
                throw new NotFoundException(
                    `Le semestre avec l'id ${semestreId} n'existe pas`,
                );
            }
        }

        return this.databaseService.module.update({
            where: {
                id,
            },
            data : {
                name ,
                code ,
                semestreId
            },
            include: {
                semestre : true
            },
        });
    }

    // Supprimer un module
    async remove(id : string){
        await this.findOne(id);

        return this.databaseService.module.delete({
            where: {
                id,
            },
        });
    }


}
