import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Not } from 'typeorm';
import { RegistrationStatus } from '@art-2026/shared';
import { TypeOrmRepository } from '../../../../shared/infrastructure/typeorm.repository';
import { Registration } from '../../domain/registration.entity';
import { IRegistrationsRepository } from '../../domain/registrations.repository.interface';
import { RegistrationTypeOrmMapper } from './registration-typeorm.mapper';
import { RegistrationPersistence } from './registration.typeorm-entity';

@Injectable()
export class RegistrationsTypeOrmRepository
  extends TypeOrmRepository<Registration, RegistrationPersistence>
  implements IRegistrationsRepository
{
  constructor(@InjectDataSource() dataSource: DataSource, mapper: RegistrationTypeOrmMapper) {
    super(dataSource, RegistrationPersistence, mapper);
  }

  async findByToken(token: string): Promise<Registration | null> {
    return this.findOneWhere({ token });
  }

  async findByPromoCode(promoCode: string): Promise<Registration | null> {
    return this.findOneWhere({ promoCode });
  }

  async sumGroupSizeForDay(day: 'painting' | 'photography', excludeId?: number): Promise<number> {
    const qb = this._repo
      .createQueryBuilder('r')
      .select('COALESCE(SUM(r.group_size), 0)', 'sum')
      .where('r.status = :status', { status: RegistrationStatus.Active });

    if (day === 'painting') qb.andWhere('r.painting_day = true');
    else qb.andWhere('r.photography_day = true');

    if (excludeId !== undefined) qb.andWhere('r.id != :excludeId', { excludeId });

    const raw = await qb.getRawOne<{ sum: string }>();
    return Number(raw?.sum ?? 0);
  }
}
