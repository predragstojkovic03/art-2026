import { Controller, Get } from '@nestjs/common';
import { IEventInfoResponse } from '@art-2026/shared';
import { EventInfoService } from '../../application/event-info.service';

@Controller('event-info')
export class EventInfoController {
  constructor(private readonly _service: EventInfoService) {}

  @Get()
  async get(): Promise<IEventInfoResponse> {
    return this._service.getEventInfo();
  }
}
