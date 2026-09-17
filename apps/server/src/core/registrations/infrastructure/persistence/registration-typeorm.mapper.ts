import { Injectable } from '@nestjs/common';
import { TypeOrmMapper } from '../../../../shared/infrastructure/typeorm.mapper';
import { Registration } from '../../domain/registration.entity';
import { RegistrationPersistence } from './registration.typeorm-entity';

@Injectable()
export class RegistrationTypeOrmMapper extends TypeOrmMapper<Registration, RegistrationPersistence> {
  toDomain(e: RegistrationPersistence): Registration {
    return Registration.reconstitute({
      id: Number(e.id),
      token: e.token,
      status: e.status,
      email: e.email,
      firstName: e.firstName,
      lastName: e.lastName,
      profession: e.profession,
      address1: e.address1,
      address2: e.address2,
      postalCode: e.postalCode,
      city: e.city,
      country: e.country,
      paintingDay: e.paintingDay,
      photographyDay: e.photographyDay,
      groupSize: e.groupSize,
      promoCode: e.promoCode,
      referrerId: e.referrerId !== null ? Number(e.referrerId) : null,
      promoCodeRedeemedAt: e.promoCodeRedeemedAt,
      totalAmount: Number(e.totalAmount),
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    });
  }

  toPersistence(d: Registration): RegistrationPersistence {
    const p = new RegistrationPersistence();
    if (d.id) p.id = String(d.id);
    p.token = d.token;
    p.status = d.status;
    p.email = d.email;
    p.firstName = d.firstName;
    p.lastName = d.lastName;
    p.profession = d.profession;
    p.address1 = d.address1;
    p.address2 = d.address2;
    p.postalCode = d.postalCode;
    p.city = d.city;
    p.country = d.country;
    p.paintingDay = d.paintingDay;
    p.photographyDay = d.photographyDay;
    p.groupSize = d.groupSize;
    p.promoCode = d.promoCode;
    p.referrerId = d.referrerId !== null ? String(d.referrerId) : null;
    p.promoCodeRedeemedAt = d.promoCodeRedeemedAt;
    p.totalAmount = String(d.totalAmount);
    p.createdAt = d.createdAt;
    p.updatedAt = d.updatedAt;
    return p;
  }
}
