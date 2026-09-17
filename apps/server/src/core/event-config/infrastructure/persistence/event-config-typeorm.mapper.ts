import { Injectable } from '@nestjs/common';
import { TypeOrmMapper } from '../../../../shared/infrastructure/typeorm.mapper';
import { EventConfig } from '../../domain/event-config.entity';
import { EventConfigPersistence } from './event-config.typeorm-entity';

@Injectable()
export class EventConfigTypeOrmMapper extends TypeOrmMapper<EventConfig, EventConfigPersistence> {
  toDomain(entity: EventConfigPersistence): EventConfig {
    return EventConfig.reconstitute({ key: entity.key, value: entity.value });
  }

  toPersistence(domain: EventConfig): EventConfigPersistence {
    const p = new EventConfigPersistence();
    p.key = domain.key;
    p.value = domain.value;
    return p;
  }
}
