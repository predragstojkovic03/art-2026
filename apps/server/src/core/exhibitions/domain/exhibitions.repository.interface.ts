import { Exhibition } from './exhibition.entity';

export const I_EXHIBITIONS_REPOSITORY = Symbol('IExhibitionsRepository');

export interface IExhibitionsRepository {
  findAll(): Promise<Exhibition[]>;
  save(entity: Exhibition): Promise<Exhibition>;
  count(): Promise<number>;
}
