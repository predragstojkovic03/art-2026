import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { validateEnv } from './env.validation';
import { EventConfigModule } from './core/event-config/event-config.module';
import { ExhibitionsModule } from './core/exhibitions/exhibitions.module';
import { RegistrationsModule } from './core/registrations/registrations.module';
import { EventInfoModule } from './core/event-info/event-info.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('ORM_SYNC') === 'true',
        entities: [join(__dirname, '**', '*.typeorm-entity.{ts,js}')],
        namingStrategy: new SnakeNamingStrategy(),
        logging: false,
      }),
      inject: [ConfigService],
    }),
    EventConfigModule,
    ExhibitionsModule,
    RegistrationsModule,
    EventInfoModule,
  ],
})
export class AppModule {}
