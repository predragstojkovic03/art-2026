import { Injectable } from '@nestjs/common';
import { EventDay, IEventInfoResponse, IExhibitionResponse } from '@art-2026/shared';
import { EventConfigService } from '../../event-config/application/event-config.service';
import { ExhibitionsService } from '../../exhibitions/application/exhibitions.service';
import { RegistrationsService } from '../../registrations/application/registrations.service';

@Injectable()
export class EventInfoService {
  constructor(
    private readonly _config: EventConfigService,
    private readonly _exhibitions: ExhibitionsService,
    private readonly _registrations: RegistrationsService,
  ) {}

  async getEventInfo(): Promise<IEventInfoResponse> {
    const config = await this._config.getAll();
    const exhibitions = await this._exhibitions.getAll();
    const freeSpots = await this._registrations.getFreeSpots();

    const exhibitionResponses: IExhibitionResponse[] = exhibitions.map((e) => ({
      id: e.id,
      day: e.day as EventDay,
      name: e.name,
      artist: e.artist,
      openingTime: e.openingTime,
      closingTime: e.closingTime,
    }));

    return {
      eventName: config.event_name ?? '',
      eventCity: config.event_city ?? '',
      eventVenue: config.event_venue ?? '',
      eventDateDay1: config.event_date_day1 ?? '',
      eventDateDay2: config.event_date_day2 ?? '',
      eventAdditionalInfo: config.event_additional_info ?? '',
      maxVisitors: Number(config.max_visitors ?? 0),
      pricePainting: Number(config.price_painting ?? 0),
      pricePhotography: Number(config.price_photography ?? 0),
      earlyBirdDeadline: config.early_bird_deadline ?? '',
      exhibitions: exhibitionResponses,
      freeSpotsPainting: freeSpots.painting,
      freeSpotsPhotography: freeSpots.photography,
    };
  }
}
