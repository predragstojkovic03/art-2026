import { IPriceBreakdown, IRegistrationResponse, RegistrationStatus } from '@art-2026/shared';
import { Registration } from '../../../domain/registration.entity';

export class RegistrationResponseDto implements IRegistrationResponse {
  id!: number;
  token!: string;
  status!: RegistrationStatus;
  firstName!: string;
  lastName!: string;
  profession!: string | null;
  address1!: string;
  address2!: string | null;
  postalCode!: string;
  city!: string;
  country!: string;
  email!: string;
  paintingDay!: boolean;
  photographyDay!: boolean;
  groupSize!: number;
  promoCode!: string;
  promoCodeRedeemedAt!: string | null;
  totalAmount!: number;
  priceBreakdown!: IPriceBreakdown;
  createdAt!: string;
  updatedAt!: string;

  static from(reg: Registration, breakdown: IPriceBreakdown): RegistrationResponseDto {
    const dto = new RegistrationResponseDto();
    dto.id = reg.id;
    dto.token = reg.token;
    dto.status = reg.status;
    dto.firstName = reg.firstName;
    dto.lastName = reg.lastName;
    dto.profession = reg.profession;
    dto.address1 = reg.address1;
    dto.address2 = reg.address2;
    dto.postalCode = reg.postalCode;
    dto.city = reg.city;
    dto.country = reg.country;
    dto.email = reg.email;
    dto.paintingDay = reg.paintingDay;
    dto.photographyDay = reg.photographyDay;
    dto.groupSize = reg.groupSize;
    dto.promoCode = reg.promoCode;
    dto.promoCodeRedeemedAt = reg.promoCodeRedeemedAt?.toISOString() ?? null;
    dto.totalAmount = reg.totalAmount;
    dto.priceBreakdown = breakdown;
    dto.createdAt = reg.createdAt.toISOString();
    dto.updatedAt = reg.updatedAt.toISOString();
    return dto;
  }
}
