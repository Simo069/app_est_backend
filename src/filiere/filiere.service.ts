/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';
import { CreateFiliereDto } from './dto/create-filiere.dto';
import { UpdateFiliereDto } from './dto/update-filiere.dto';



@Injectable()
export class FiliereService {
  constructor(private readonly databaseService: DatabaseService) {}

    async create(createFilierDto: CreateFiliereDto) {
    const { name, code, niveauId } = createFilierDto;
    const niveau = await this.databaseService.niveau.findUnique({
        where: {
        id: niveauId,
        },
    });

    if (!niveau) {
        throw new NotFoundException('Le niveau spécifié n’existe pas');
    }
    if (code) {
        const existingFiliere = await this.databaseService.filiere.findUnique({
        where: {
            code,
        },
        });
        if (existingFiliere) {
        throw new ConflictException('Une filière avec ce code existe déjà');
        }

    }
    return this.databaseService.filiere.create({
        data:{
            name,
            code,
            niveauId
        },
        include: {
            niveau: true
        }
    })
    }


    async findAll(){
        return this.databaseService.filiere.findMany({
            include : {
                niveau : true ,
                semestres : true 
            },
            orderBy : {
                createdAt : 'desc'
            }
        })
    }


    async findOne(id:string){
        const filiere = await this.databaseService.filiere.findUnique({
            where: {
                id,
            },
            include: {
                niveau : true ,
                semestres : true 
            }
        })

        if(!filiere){
            throw new NotFoundException(
                `La filière avec l'id ${id} n'existe pas`,
            );
        }
        return filiere;
    }

    async findByNiveauId(niveauId : string){
        const niveau = await this.databaseService.niveau.findUnique({
            where: {
                id: niveauId
            }
        });
        if (!niveau){
            throw new NotFoundException(
                `Le niveau avec l'id ${niveauId} n'existe pas`,
            );
        }
        return this.databaseService.filiere.findMany({
            where: {
                niveauId
            },
            include : {
                niveau : true
            },
            orderBy: {
                createdAt : 'desc'
            }
        })
    }



    async update(id: string , updateFiliereDto: UpdateFiliereDto){
        await this.findOne(id);
        const { name, code, niveauId } = updateFiliereDto;
        // Si le niveau est modifié
        if (niveauId) {
            const niveau = await this.databaseService.niveau.findUnique({
            where: {
                id: niveauId,
            },
            });
    
            if (!niveau) {
            throw new NotFoundException(
                'Le niveau spécifié n’existe pas',
            );
            }
        }
    
        // Vérifier si le code appartient déjà à une autre filière
        if (code) {
            const existingFiliere =
            await this.databaseService.filiere.findUnique({
                where: {
                code,
                },
            });
    
            if (existingFiliere && existingFiliere.id !== id) {
            throw new ConflictException(
                'Une filière avec ce code existe déjà',
            );
            }
        }
    
        return this.databaseService.filiere.update({
            where: {
            id,
            },
            data: {
            name,
            code,
            niveauId,
            },
            include: {
            niveau: true,
            },
        });
    }

    async remove(id:string){
        await this.findOne(id);
        return this.databaseService.filiere.delete({
            where : {
                id
            }
        })
    }
}
