/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ConflictException,
  Injectable,
  NotFoundException, } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateSemestreDto } from './dto/create-semestre.dto';
import { UpdateSemestreDto } from './dto/update-semestre.dto';



@Injectable()
export class SemestreService {
    constructor(private readonly databaseService : DatabaseService){}

    // ==========================================
    // Créer un semestre
    // ==========================================

    async create(createSemestreDto: CreateSemestreDto){
        const {name , order , filiereId} = createSemestreDto;

        const filiere = await this.databaseService.filiere.findUnique({
            where: {
                id : filiereId
            }
        })

        if(!filiere){
            throw new NotFoundException(
        `La filière avec l'id ${filiereId} n'existe pas`,
        );
        }

        const existingSemestre = await this.databaseService.semestre.findUnique({
            where : {
                filiereId_order:{
                    filiereId,
                    order,
                },
            },
        });

        if(existingSemestre){
            throw new ConflictException(
                `Le semestre avec l'ordre ${order} existe déjà dans cette filière`,
            );
        }
        
        return this.databaseService.semestre.create({
            data : {
                name, 
                order,
                filiereId
            },
            include: {
                filiere: true
            }
        });
    }

    // Récupérer tous les semestres

    async findAll(){
        return  this.databaseService.semestre.findMany({
            include: {
                filiere: true,
                modules: true
            },
            orderBy : {
                order : 'asc'
            }
        })
    }

    // Récupérer un semestre par ID
    async findOne(id: string){
        const semestre = await this.databaseService.semestre.findUnique({
            where: {
                id,
            },
            include: {
                filiere: true,
                modules: true
            }
        });
        if(!semestre){
            throw new NotFoundException(
                `Le semestre avec l'id ${id} n'existe pas`,
            );
        }

        return semestre;
    }

    // Récupérer les semestre d'une filière
    async findByFiliereId(filiereId : string){
        const filiere = await this.databaseService.filiere.findMany({
            where : {
                id : filiereId
            }
        });

        if(!filiere){
            throw new NotFoundException(
                `La filière avec l'id ${filiereId} n'existe pas`,
            );
        }
        
        return this.databaseService.semestre.findMany({
            where:{
                filiereId,
            },
            include: {
                filiere: true,
            },
            orderBy : {
                order : 'asc'
            },
            
        })
    }

    // Modifier un semestre
    async update(id : string , updateSemestreDto : UpdateSemestreDto){
        // Vérifier que le semestre existe
        const currentSemestre = await this.findOne(id);
        const {name , order , filiereId} = updateSemestreDto;
        if (filiereId) {
            const filiere = await this.databaseService.filiere.findUnique({
                where: {
                    id: filiereId,
                },
            });

            if (!filiere) {
            throw new NotFoundException(
                `La filière avec l'id ${filiereId} n'existe pas`,
            );
            }
        }

        // Vérifier l'unicité de l'ordre
        if(order != undefined){
            const targetFiliereId = filiereId ?? currentSemestre.filiereId;
            
            const existingSemestre = await this.databaseService.semestre.findUnique({
                where : {
                    filiereId_order: {
                        filiereId: targetFiliereId,
                        order,
                    },
                }
            });

            if(existingSemestre && existingSemestre.id !== id){
                throw new ConflictException(
                    `Le semestre avec l'ordre ${order} existe déjà dans cette filière`,
                );
            }
        }
        return this.databaseService.semestre.update({
            where: {
                id,
            },
            data : {
                name , 
                order,
                filiereId
            },
            include : {
                filiere: true ,
            }
        });
    }

    // Supprimer un semestre
    async remove(id: string){
        await this.findOne(id);

        return this.databaseService.semestre.delete({
            where: {
                id,
            },
        });
    }
    
}
