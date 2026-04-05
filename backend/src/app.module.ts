import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ClsModule, ClsService } from 'nestjs-cls';
import {
  addTransactionalDataSource,
  getDataSourceByName,
} from 'typeorm-transactional';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@modules/internal/user/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ExternalApiModule } from '@modules/external-api/external-api.module';
import { AuthGuard } from '@modules/auth/guards/auth.guard';
import { ClsUtil } from '@shared/utilities/clstUtil';

import { DataSourceConfig } from '@config/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env.development',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          ...DataSourceConfig,
          autoLoadEntities: true,
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return (
          getDataSourceByName('default') ||
          addTransactionalDataSource(new DataSource(options))
        );
      },
    }),

    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    UsersModule,
    AuthModule,
    ExternalApiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  constructor(private clsService: ClsService) {}

  onModuleInit() {
    ClsUtil.init(this.clsService);
  }
}
