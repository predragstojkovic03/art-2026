import { IEventInfoResponse } from '@art-2026/shared';
import { HttpClient } from '@/shared/infrastructure/http/http-client';
import type { IEventInfoService } from '../domain/event-info-service.interface';

export class EventInfoService implements IEventInfoService {
  constructor(private readonly _http: HttpClient) {}

  async getEventInfo(): Promise<IEventInfoResponse> {
    return this._http.get<IEventInfoResponse>('/event-info');
  }
}
