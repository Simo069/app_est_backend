/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable, BadRequestException  } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MinioService } from 'src/minio/minio.service';

import { RandomUUIDOptions } from 'crypto';
import { ResourceType } from '@prisma/client';

const BUCKET = 'course-materials';

@Injectable()
export class RessourcesService {
    constructor(private databaseService : DatabaseService , 
        private minio : MinioService){}

    async uploadRessource(
        file : Express.Multer.File,
        dto : {title : string ; type : ResourceType ; moduleId : string },
        userId : string
    ){
        
        if(!file){
            throw new BadRequestException('Fichier requis ');
        }
        
        // Récupère le module pour construire un chemin lisible
        const module = await this.databaseService.module.findUnique({
            where:{
                id : dto.moduleId,
                
            },
            select : {code : true}
        });
        if(!module){
            throw new BadRequestException('Module introuvable');
        }

        // Ex: modules/alg101/1699999999-chapitre-1.pdf
        const safeFilename = file.originalname.replace(/\s+/g, '-');
        const objectKey = `modules/${module.code?.toLowerCase() || dto.moduleId}/${Date.now()}-${safeFilename}`;
        // 1. Upload vers MinIO
        await this.minio.uploadFile(BUCKET, objectKey, file.buffer, file.mimetype);
        return this.databaseService.resource.create({
            data: {
                title: dto.title,
                type: dto.type,
                filename: file.originalname,
                mimeType: file.mimetype,
                sizeBytes: file.size,
                bucket: BUCKET,
                objectKey,
                moduleId: dto.moduleId,
                uploadedById: userId,
            },
        });
    }

    async getDownloadUrl(resourceId : string){
        const resource = await this.databaseService.resource.findFirstOrThrow({
            where : {id : resourceId},
        });

        // Incrémente le compteur de téléchargement
        await this.databaseService.resource.update({
            where:{id : resourceId},
            data :{downloadCount : {increment: 1}},
        });

        // URL temporaire valable 1h
        const url = await this.minio.getPresignedDownloadUrl(
            resource.bucket,
            resource.objectKey,
            3600
        );
        return { url , filename : resource.filename}
    }

    async findByModuleAndType(moduleId : string , type? : ResourceType){
        const whereClause: { moduleId: string; type?: ResourceType } = { moduleId };
        if (type) {
            whereClause.type = type;
        }

        return this.databaseService.resource.findMany({
            where : whereClause,
            orderBy : {createdAt: 'asc'},
            select : {
                id : true ,
                title : true ,
                type : true ,
                filename: true,
                mimeType: true,
                sizeBytes: true,
                downloadCount: true,
                createdAt: true,
            }
        })
    }

    async findAll() {
        return this.databaseService.resource.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                module: {
                    include: {
                        semestre: {
                            include: {
                                filiere: {
                                    include: {
                                        niveau: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    async deleteRessource(id: string) {
        const resource = await this.databaseService.resource.findUnique({
            where: { id }
        });
        if (!resource) {
            throw new BadRequestException('Ressource introuvable');
        }
        try {
            await this.minio.deleteFile(resource.bucket, resource.objectKey);
        } catch (err) {
            console.error('Erreur suppression fichier MinIO:', err);
        }
        return this.databaseService.resource.delete({
            where: { id }
        });
    }
}
