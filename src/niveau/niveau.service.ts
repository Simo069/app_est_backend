/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma, Role } from '@prisma/client';

import { CreateNiveauDto } from './dto/create-niveau.dto';
import { UpdateNiveauDto } from './dto/update-niveau.dto';


@Injectable()
export class NiveauService {
    constructor(private readonly databaseService: DatabaseService) { }

    // create niveau
    async create(createNiveuaDto: CreateNiveauDto) {
        console.log('DATABASE_URL:', process.env.DATABASE_URL);
        const niveau = await this.databaseService.niveau.create({
            data: createNiveuaDto
        });

        return niveau;
    }

    // Get All niveaux
    async findAll() {
        const niveaux = await this.databaseService.niveau.findMany(
            {
                orderBy: {
                    order: 'asc'
                }
            }
        );
        return niveaux;
    }s

    // GET BY ID
    async findOne(id: string) {
        const niveau = await this.databaseService.niveau.findUnique({
            where: {
                id,
            }
        })

        if (!niveau) {
            throw new NotFoundException(
                `Niveau avec l'id ${id} introuvable`
            );
        }
        return niveau;
    }

    // update 
    async update(id: string, updateNiveauDto: UpdateNiveauDto) {
        await this.findOne(id);
        const niveau = await this.databaseService.niveau.update({
            where: {
                id
            },
            data: updateNiveauDto,
        });
        return niveau;
    }

    // Delete 

    async delete(id: string) {
        await this.findOne(id);
        return await this.databaseService.niveau.delete({
            where: {
                id,
            }
        });

    }

    // async findFilieresByNiveauId(niveauId: string){
    //     const niveau = await this.databaseService.niveau.findUnique({
    //         where: {
    //             id : niveauId,
    //         },
    //         include : {
    //             filieres : {
    //                 orderBy : {
    //                     createdAt: 'desc'
    //                 }
    //             }
    //         }
    //     });
    //     if (!niveau){
    //         throw new NotFoundException(
    //             `Le niveau avec l'id ${niveauId} n'existe pas`,
    //         );
    //     }

    //     return niveau.filieres;
    // }
}
