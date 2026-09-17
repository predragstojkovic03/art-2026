import { Entity } from './entity.base';

export interface IRepository<T extends Entity<any>> {
  save(entity: T): Promise<T>;
  findAll(): Promise<T[]>;
  count(): Promise<number>;
}
