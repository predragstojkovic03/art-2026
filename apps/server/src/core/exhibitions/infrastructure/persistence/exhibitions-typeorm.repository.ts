import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmRepository } from '../../../../shared/infrastructure/typeorm.repository';
import { Exhibition } from '../../domain/exhibition.entity';
import { IExhibitionsRepository } from '../../domain/exhibitions.repository.interface';
import { ExhibitionTypeOrmMapper } from './exhibition-typeorm.mapper';
import { ExhibitionPersistence } from './exhibition.typeorm-entity';

@Injectable()
export class ExhibitionsTypeOrmRepository
  extends TypeOrmRepository<Exhibition, ExhibitionPersistence>
  implements IExhibitionsRepository
{
  constructor(@InjectDataSource() dataSource: DataSource, mapper: ExhibitionTypeOrmMapper) {
    super(dataSource, ExhibitionPersistence, mapper);
  }
}
