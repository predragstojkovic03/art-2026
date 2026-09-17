import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EventConfig } from '../domain/event-config.entity';
import {
  I_EVENT_CONFIG_REPOSITORY,
  IEventConfigRepository,
} from '../domain/event-config.repository.interface';

const DEFAULT_CONFIG: Record<string, string> = {
  event_name: 'Art 2026',
  event_city: 'Beograd',
  event_venue: 'Dom kulture Studentski grad',
  event_date_day1: '2026-05-16',
  event_date_day2: '2026-05-17',
  event_additional_info: 'Ulaz slobodan za studente uz indeks. Ponesite lični dokument.',
  max_visitors: '200',
  price_painting: '1500',
  price_photography: '2000',
  early_bird_deadline: '2026-04-30',
};

@Injectable()
export class EventConfigService implements OnModuleInit {
  constructor(
    @Inject(I_EVENT_CONFIG_REPOSITORY) private readonly _repository: IEventConfigRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this._repository.count();
    if (count > 0) return;
    for (const [key, value] of Object.entries(DEFAULT_CONFIG)) {
      await this._repository.save(EventConfig.create({ key, value }));
    }
  }

  async getAll(): Promise<Record<string, string>> {
    const configs = await this._repository.findAll();
    return configs.reduce<Record<string, string>>((acc, c) => {
      acc[c.key] = c.value;
      return acc;
    }, {});
  }

  async getByKey(key: string): Promise<string | null> {
    const config = await this._repository.findByKey(key);
    return config ? config.value : null;
  }
}
