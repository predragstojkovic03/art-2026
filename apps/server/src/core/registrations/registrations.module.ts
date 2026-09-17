import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventConfigModule } from '../event-config/event-config.module';
import { RegistrationsService } from './application/registrations.service';
import { I_REGISTRATIONS_REPOSITORY } from './domain/registrations.repository.interface';
import { RegistrationTypeOrmMapper } from './infrastructure/persistence/registration-typeorm.mapper';
import { RegistrationsTypeOrmRepository } from './infrastructure/persistence/registrations-typeorm.repository';
import { RegistrationPersistence } from './infrastructure/persistence/registration.typeorm-entity';
import { RegistrationsController } from './presentation/rest/registrations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RegistrationPersistence]), EventConfigModule],
  controllers: [RegistrationsController],
  providers: [
    RegistrationsService,
    RegistrationTypeOrmMapper,
    {
      provide: I_REGISTRATIONS_REPOSITORY,
      useClass: RegistrationsTypeOrmRepository,
    },
  ],
  exports: [RegistrationsService, I_REGISTRATIONS_REPOSITORY],
})
export class RegistrationsModule {}
