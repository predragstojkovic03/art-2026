import { EventDay } from '../enums/event-day.enum';

export interface IExhibitionResponse {
  id: number;
  day: EventDay;
  name: string;
  artist: string;
  openingTime: string;
  closingTime: string;
}
