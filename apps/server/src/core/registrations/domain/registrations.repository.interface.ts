import { Registration } from './registration.entity';

export const I_REGISTRATIONS_REPOSITORY = Symbol('IRegistrationsRepository');

export interface IRegistrationsRepository {
  save(registration: Registration): Promise<Registration>;
  findByToken(token: string): Promise<Registration | null>;
  findByPromoCode(promoCode: string): Promise<Registration | null>;
  sumGroupSizeForDay(day: 'painting' | 'photography', excludeId?: number): Promise<number>;
}
