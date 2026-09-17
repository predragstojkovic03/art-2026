import { RegistrationStatus } from '../enums/registration-status.enum';
import { IPriceBreakdown } from './price-breakdown.interface';

export interface ICreateRegistration {
  firstName: string;
  lastName: string;
  profession?: string;
  address1: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  email: string;
  emailConfirm: string;
  paintingDay: boolean;
  photographyDay: boolean;
  groupSize: number;
  promoCode?: string;
}

export interface IUpdateRegistration {
  paintingDay?: boolean;
  photographyDay?: boolean;
  groupSize?: number;
}

export interface IRegistrationResponse {
  id: number;
  token: string;
  status: RegistrationStatus;
  firstName: string;
  lastName: string;
  profession: string | null;
  address1: string;
  address2: string | null;
  postalCode: string;
  city: string;
  country: string;
  email: string;
  paintingDay: boolean;
  photographyDay: boolean;
  groupSize: number;
  promoCode: string;
  promoCodeRedeemedAt: string | null;
  totalAmount: number;
  priceBreakdown: IPriceBreakdown;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateRegistrationResponse extends IRegistrationResponse {}
