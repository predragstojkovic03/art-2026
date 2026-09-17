import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  EntityTarget,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { Entity } from '../domain/entity.base';
import { TypeOrmMapper } from './typeorm.mapper';

export abstract class TypeOrmRepository<
  TDomain extends Entity<any>,
  TPersistence extends ObjectLiteral,
> {
  constructor(
    @InjectDataSource() protected readonly _dataSource: DataSource,
    private readonly _entityTarget: EntityTarget<TPersistence>,
    protected readonly _mapper: TypeOrmMapper<TDomain, TPersistence>,
  ) {}

  protected get _repo(): Repository<TPersistence> {
    return this._dataSource.getRepository(this._entityTarget);
  }

  async save(entity: TDomain): Promise<TDomain> {
    const persistence = this._mapper.toPersistence(entity);
    const saved = await this._repo.save(persistence as any);
    return this._mapper.toDomain(saved);
  }

  async findAll(): Promise<TDomain[]> {
    const entities = await this._repo.find();
    return entities.map((e) => this._mapper.toDomain(e));
  }

  async count(): Promise<number> {
    return this._repo.count();
  }

  protected async findOneWhere(
    where: FindOptionsWhere<TPersistence>,
  ): Promise<TDomain | null> {
    const entity = await this._repo.findOne({ where });
    return entity ? this._mapper.toDomain(entity) : null;
  }
}
