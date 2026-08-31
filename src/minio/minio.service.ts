import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';

const BUCKET_NAME = process.env.MINIO_BUCKET || 'course-materials';

@Injectable()
export class MinioService implements OnModuleInit {
    private client: Client;

    constructor() {
        // Nettoyage de l'URL d'endpoint (suppression de http:// ou https://)
        const rawEndpoint = process.env.MINIO_ENDPOINT || 'localhost';
        const cleanEndpoint = rawEndpoint.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim();

        const isCloudProvider = cleanEndpoint.includes('cloudflarestorage.com') || cleanEndpoint.includes('amazonaws.com');
        const portEnv = process.env.MINIO_PORT;
        const port = portEnv ? parseInt(portEnv, 10) : (isCloudProvider ? 443 : 9000);

        const useSSL = process.env.MINIO_USE_SSL !== undefined
            ? process.env.MINIO_USE_SSL === 'true'
            : (isCloudProvider || port === 443);

        const region = process.env.MINIO_REGION || (isCloudProvider ? 'auto' : undefined);

        const clientOptions: any = {
            endPoint: cleanEndpoint,
            useSSL,
            accessKey: process.env.MINIO_ROOT_USER || process.env.MINIO_ACCESS_KEY || 'minio_admin',
            secretKey: process.env.MINIO_ROOT_PASSWORD || process.env.MINIO_SECRET_KEY || 'changeme123',
        };

        if (port && port !== 80 && port !== 443) {
            clientOptions.port = port;
        }

        if (region) {
            clientOptions.region = region;
        }

        this.client = new Client(clientOptions);
    }

    async onModuleInit() {
        try {
            const exists = await this.client.bucketExists(BUCKET_NAME);
            if (!exists) {
                await this.client.makeBucket(BUCKET_NAME, process.env.MINIO_REGION || 'auto');
            }
        } catch (err) {
            console.warn('Vérification du bucket S3/MinIO/R2:', err instanceof Error ? err.message : err);
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
        const targetBucket = bucket || BUCKET_NAME;
        await this.client.putObject(targetBucket, objectKey, buffer, buffer.length, {
            'Content-Type': mimeType,
        });
    }

    async getPresignedDownloadUrl(
        bucket: string,
        objectKey: string,
        expirySeconds = 3600,
    ) {
        const targetBucket = bucket || BUCKET_NAME;
        return this.client.presignedGetObject(targetBucket, objectKey, expirySeconds);
    }

    async deleteFile(bucket: string, objectKey: string) {
        const targetBucket = bucket || BUCKET_NAME;
        await this.client.removeObject(targetBucket, objectKey);
    }

    async getFileStream(bucket: string, objectKey: string) {
        const targetBucket = bucket || BUCKET_NAME;
        return this.client.getObject(targetBucket, objectKey);
    }
}
