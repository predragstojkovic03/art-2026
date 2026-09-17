import { Injectable } from '@nestjs/common';
import { EventDay } from '@art-2026/shared';
import { TypeOrmMapper } from '../../../../shared/infrastructure/typeorm.mapper';
import { Exhibition } from '../../domain/exhibition.entity';
import { ExhibitionPersistence } from './exhibition.typeorm-entity';

@Injectable()
export class ExhibitionTypeOrmMapper extends TypeOrmMapper<Exhibition, ExhibitionPersistence> {
  toDomain(entity: ExhibitionPersistence): Exhibition {
    return Exhibition.reconstitute({
      id: Number(entity.id),
      day: entity.day as EventDay,
      name: entity.name,
      artist: entity.artist,
      openingTime: entity.openingTime,
      closingTime: entity.closingTime,
    });
  }

  toPersistence(domain: Exhibition): ExhibitionPersistence {
    const p = new ExhibitionPersistence();
    if (domain.id) p.id = String(domain.id);
    p.day = domain.day;
    p.name = domain.name;
    p.artist = domain.artist;
    p.openingTime = domain.openingTime;
    p.closingTime = domain.closingTime;
    return p;
  }
}
