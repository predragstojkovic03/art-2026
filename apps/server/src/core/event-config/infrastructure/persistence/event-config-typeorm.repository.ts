import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmRepository } from '../../../../shared/infrastructure/typeorm.repository';
import { EventConfig } from '../../domain/event-config.entity';
import { IEventConfigRepository } from '../../domain/event-config.repository.interface';
import { EventConfigTypeOrmMapper } from './event-config-typeorm.mapper';
import { EventConfigPersistence } from './event-config.typeorm-entity';

@Injectable()
export class EventConfigTypeOrmRepository
  extends TypeOrmRepository<EventConfig, EventConfigPersistence>
  implements IEventConfigRepository
{
  constructor(@InjectDataSource() dataSource: DataSource, mapper: EventConfigTypeOrmMapper) {
    super(dataSource, EventConfigPersistence, mapper);
  }

  async findByKey(key: string): Promise<EventConfig | null> {
    return this.findOneWhere({ key });
  }
}
