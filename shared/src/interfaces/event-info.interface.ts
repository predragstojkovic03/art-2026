import { IExhibitionResponse } from './exhibition.interface';

export interface IEventInfoResponse {
  eventName: string;
  eventCity: string;
  eventVenue: string;
  eventDateDay1: string;
  eventDateDay2: string;
  eventAdditionalInfo: string;
  maxVisitors: number;
  pricePainting: number;
  pricePhotography: number;
  earlyBirdDeadline: string;
  exhibitions: IExhibitionResponse[];
  freeSpotsPainting: number;
  freeSpotsPhotography: number;
}
