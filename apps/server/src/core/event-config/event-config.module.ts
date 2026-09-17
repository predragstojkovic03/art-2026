import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventConfigService } from './application/event-config.service';
import { I_EVENT_CONFIG_REPOSITORY } from './domain/event-config.repository.interface';
import { EventConfigTypeOrmMapper } from './infrastructure/persistence/event-config-typeorm.mapper';
import { EventConfigTypeOrmRepository } from './infrastructure/persistence/event-config-typeorm.repository';
import { EventConfigPersistence } from './infrastructure/persistence/event-config.typeorm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventConfigPersistence])],
  providers: [
    EventConfigService,
    EventConfigTypeOrmMapper,
    {
      provide: I_EVENT_CONFIG_REPOSITORY,
      useClass: EventConfigTypeOrmRepository,
    },
  ],
  exports: [EventConfigService],
})
export class EventConfigModule {}
