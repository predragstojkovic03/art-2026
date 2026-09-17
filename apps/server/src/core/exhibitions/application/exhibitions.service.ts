import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EventDay } from '@art-2026/shared';
import { Exhibition } from '../domain/exhibition.entity';
import {
  I_EXHIBITIONS_REPOSITORY,
  IExhibitionsRepository,
} from '../domain/exhibitions.repository.interface';

const DEFAULT_EXHIBITIONS: Array<{
  day: EventDay;
  name: string;
  artist: string;
  openingTime: string;
  closingTime: string;
}> = [
  { day: EventDay.Painting, name: 'Boje Balkana', artist: 'Milena Pavlović', openingTime: '10:00:00', closingTime: '13:00:00' },
  { day: EventDay.Painting, name: 'Moderni izraz', artist: 'Aleksandar Jović', openingTime: '13:30:00', closingTime: '16:30:00' },
  { day: EventDay.Painting, name: 'Nova generacija', artist: 'Sara Nikolić', openingTime: '17:00:00', closingTime: '20:00:00' },
  { day: EventDay.Photography, name: 'Ulična perspektiva', artist: 'Marko Simić', openingTime: '10:00:00', closingTime: '13:00:00' },
  { day: EventDay.Photography, name: 'Portreti grada', artist: 'Ana Radović', openingTime: '13:30:00', closingTime: '16:30:00' },
  { day: EventDay.Photography, name: 'Kroz objektiv vremena', artist: 'Nikola Tomić', openingTime: '17:00:00', closingTime: '20:00:00' },
];

@Injectable()
export class ExhibitionsService implements OnModuleInit {
  constructor(
    @Inject(I_EXHIBITIONS_REPOSITORY) private readonly _repository: IExhibitionsRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this._repository.count();
    if (count > 0) return;
    for (const props of DEFAULT_EXHIBITIONS) {
      await this._repository.save(Exhibition.create(props));
    }
  }

  async getAll(): Promise<Exhibition[]> {
    return this._repository.findAll();
  }
}
