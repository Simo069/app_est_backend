/* eslint-disable prettier/prettier */
import { Injectable , OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinioService {
    private client: Client ;

    constructor() {
        this.client = new Client({
            endPoint: process.env.MINIO_ENDPOINT || 'localhost',
            port: parseInt(process.env.MINIO_PORT || '9000'),
            useSSL: false,
            accessKey: process.env.MINIO_ROOT_USER || 'minio_admin',
            secretKey: process.env.MINIO_ROOT_PASSWORD || 'changeme123',
        });
    }
    async onModuleInit() {
    // s'assure que le bucket existe au démarrage
        const exists = await this.client.bucketExists('course-materials');
        if (!exists) {
            await this.client.makeBucket('course-materials');
        }
    }

    getClient() {
        return this.client;
    }

    async uploadFile(
    bucket: string,
    objectKey: string,
    buffer: Buffer,
    mimeType: string,
    ) {
        await this.client.putObject(bucket, objectKey, buffer, buffer.length, {
            'Content-Type': mimeType,
        });
    }

    async getPresignedDownloadUrl(
    bucket: string,
    objectKey: string,
    expirySeconds = 3600,
    ) {
    // URL temporaire et sécurisée — pas besoin d'exposer MinIO publiquement
        return this.client.presignedGetObject(bucket, objectKey, expirySeconds);
    }

    async deleteFile(bucket: string, objectKey: string) {
        await this.client.removeObject(bucket, objectKey);
    }

    async getFileStream(bucket: string, objectKey: string) {
        return this.client.getObject(bucket, objectKey);
    }
}
