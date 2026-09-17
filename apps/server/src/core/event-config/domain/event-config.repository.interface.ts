import { EventConfig } from './event-config.entity';

export const I_EVENT_CONFIG_REPOSITORY = Symbol('IEventConfigRepository');

export interface IEventConfigRepository {
  findAll(): Promise<EventConfig[]>;
  findByKey(key: string): Promise<EventConfig | null>;
  save(entity: EventConfig): Promise<EventConfig>;
  count(): Promise<number>;
}
