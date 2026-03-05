import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/internal/user/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ExternalApiModule } from './modules/external-api/external-api.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(
        __dirname,
        `../.env.${process.env.NODE_ENV || 'development'}`,
      ),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST', 'localhost'),
        port: config.get<number>('POSTGRES_PORT', 5432),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: false,
      }),
    }),
    UsersModule,
    AuthModule,
    ExternalApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
