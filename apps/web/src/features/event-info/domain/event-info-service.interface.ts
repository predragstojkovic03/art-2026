import { IEventInfoResponse } from '@art-2026/shared';

export interface IEventInfoService {
  getEventInfo(): Promise<IEventInfoResponse>;
}
