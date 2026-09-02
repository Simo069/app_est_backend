import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { NiveauModule } from './niveau/niveau.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerBehindProxyGuard } from './common/guards/throttler.behind-proxy.guard';
import { FiliereModule } from './filiere/filiere.module';
import { SemestreModule } from './semestre/semestre.module';
import { ModulesModule } from './modules/modules.module';
import { MinioModule } from './minio/minio.module';
import { RessourcesModule } from './ressources/ressources.module';
import { AuthModule } from './auth/auth.module';

import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      ttl: 300000, // 5 minutes en millisecondes
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 100000,
        limit: 300,
      },
    ]),
    UsersModule,
    NiveauModule,
    DatabaseModule,
    FiliereModule,
    SemestreModule,
    ModulesModule,
    MinioModule,
    RessourcesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    AppService,
  ],
})
export class AppModule {}
