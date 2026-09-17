import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RegistrationStatus } from '@art-2026/shared';
import { EventConfigService } from '../../event-config/application/event-config.service';
import { Registration } from '../domain/registration.entity';
import {
  I_REGISTRATIONS_REPOSITORY,
  IRegistrationsRepository,
} from '../domain/registrations.repository.interface';
import { calculatePriceBreakdown, PriceBreakdownDto } from './dto/price-breakdown.dto';

interface CreateInput {
  email: string;
  emailConfirm: string;
  firstName: string;
  lastName: string;
  profession?: string | null;
  address1: string;
  address2?: string | null;
  postalCode: string;
  city: string;
  country: string;
  paintingDay: boolean;
  photographyDay: boolean;
  groupSize: number;
  promoCode?: string | null;
}

interface UpdateInput {
  paintingDay?: boolean;
  photographyDay?: boolean;
  groupSize?: number;
}

@Injectable()
export class RegistrationsService {
  constructor(
    @Inject(I_REGISTRATIONS_REPOSITORY) private readonly _repository: IRegistrationsRepository,
    private readonly _config: EventConfigService,
  ) {}

  async create(input: CreateInput): Promise<Registration> {
    if (input.email !== input.emailConfirm) throw new BadRequestException('Emails do not match');
    if (!input.paintingDay && !input.photographyDay) {
      throw new BadRequestException('At least one day must be selected');
    }

    const configVals = await this._loadConfig();
    let referrer: Registration | null = null;
    if (input.promoCode) {
      referrer = await this._repository.findByPromoCode(input.promoCode);
      if (!referrer || referrer.status !== RegistrationStatus.Active) {
        throw new BadRequestException('Invalid promo code');
      }
    }

    await this._assertSpotsAvailable(input.paintingDay, input.photographyDay, input.groupSize);

    const breakdown = calculatePriceBreakdown({
      paintingDay: input.paintingDay,
      photographyDay: input.photographyDay,
      groupSize: input.groupSize,
      hasReferrer: !!referrer,
      pricePainting: configVals.pricePainting,
      pricePhotography: configVals.pricePhotography,
      earlyBirdDeadline: configVals.earlyBirdDeadline,
    });

    const registration = Registration.create({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      profession: input.profession ?? null,
      address1: input.address1,
      address2: input.address2 ?? null,
      postalCode: input.postalCode,
      city: input.city,
      country: input.country,
      paintingDay: input.paintingDay,
      photographyDay: input.photographyDay,
      groupSize: input.groupSize,
      referrerId: referrer?.id ?? null,
      totalAmount: breakdown.totalAmount,
    });

    const saved = await this._repository.save(registration);

    if (referrer) {
      referrer.markPromoCodeRedeemed(new Date());
      await this._repository.save(referrer);
    }

    return saved;
  }

  async findByTokenAndEmail(token: string, email: string): Promise<Registration> {
    const reg = await this._repository.findByToken(token);
    if (!reg) throw new NotFoundException('Registration not found');
    if (reg.email.toLowerCase() !== email.toLowerCase()) {
      throw new ForbiddenException('Email does not match token');
    }
    return reg;
  }

  async update(token: string, email: string, input: UpdateInput): Promise<Registration> {
    const reg = await this.findByTokenAndEmail(token, email);
    if (reg.status === RegistrationStatus.Cancelled) {
      throw new BadRequestException('Cannot edit cancelled registration');
    }
    const newPainting = input.paintingDay ?? reg.paintingDay;
    const newPhotography = input.photographyDay ?? reg.photographyDay;
    const newGroup = input.groupSize ?? reg.groupSize;

    if (!newPainting && !newPhotography) throw new BadRequestException('At least one day required');

    const configVals = await this._loadConfig();

    if (newPainting && (!reg.paintingDay || newGroup > reg.groupSize)) {
      const delta = newPainting && !reg.paintingDay ? newGroup : newGroup - reg.groupSize;
      if (delta > 0) await this._assertSpotsAvailable(true, false, delta, reg.id);
    }
    if (newPhotography && (!reg.photographyDay || newGroup > reg.groupSize)) {
      const delta = newPhotography && !reg.photographyDay ? newGroup : newGroup - reg.groupSize;
      if (delta > 0) await this._assertSpotsAvailable(false, true, delta, reg.id);
    }

    reg.updateDays(newPainting, newPhotography);
    reg.updateGroupSize(newGroup);

    const breakdown = calculatePriceBreakdown({
      paintingDay: newPainting,
      photographyDay: newPhotography,
      groupSize: newGroup,
      hasReferrer: reg.referrerId !== null,
      pricePainting: configVals.pricePainting,
      pricePhotography: configVals.pricePhotography,
      earlyBirdDeadline: configVals.earlyBirdDeadline,
    });
    reg.updateTotalAmount(breakdown.totalAmount);
    return this._repository.save(reg);
  }

  async cancel(token: string, email: string): Promise<Registration> {
    const reg = await this.findByTokenAndEmail(token, email);
    if (reg.status === RegistrationStatus.Cancelled) throw new BadRequestException('Already cancelled');
    reg.cancel();
    return this._repository.save(reg);
  }

  async computeBreakdown(reg: Registration): Promise<PriceBreakdownDto> {
    const c = await this._loadConfig();
    return calculatePriceBreakdown({
      paintingDay: reg.paintingDay,
      photographyDay: reg.photographyDay,
      groupSize: reg.groupSize,
      hasReferrer: reg.referrerId !== null,
      pricePainting: c.pricePainting,
      pricePhotography: c.pricePhotography,
      earlyBirdDeadline: c.earlyBirdDeadline,
    });
  }

  async getFreeSpots(): Promise<{ painting: number; photography: number }> {
    const max = Number((await this._config.getByKey('max_visitors')) ?? '0');
    const usedPainting = await this._repository.sumGroupSizeForDay('painting');
    const usedPhoto = await this._repository.sumGroupSizeForDay('photography');
    return { painting: Math.max(0, max - usedPainting), photography: Math.max(0, max - usedPhoto) };
  }

  private async _loadConfig(): Promise<{ pricePainting: number; pricePhotography: number; earlyBirdDeadline: Date; maxVisitors: number }> {
    const [pp, pph, ebd, mv] = await Promise.all([
      this._config.getByKey('price_painting'),
      this._config.getByKey('price_photography'),
      this._config.getByKey('early_bird_deadline'),
      this._config.getByKey('max_visitors'),
    ]);
    return {
      pricePainting: Number(pp),
      pricePhotography: Number(pph),
      earlyBirdDeadline: new Date(ebd ?? '2026-04-30'),
      maxVisitors: Number(mv),
    };
  }

  private async _assertSpotsAvailable(painting: boolean, photography: boolean, addingCount: number, excludeId?: number): Promise<void> {
    const { maxVisitors } = await this._loadConfig();
    if (painting) {
      const used = await this._repository.sumGroupSizeForDay('painting', excludeId);
      if (used + addingCount > maxVisitors) throw new BadRequestException('Not enough spots for painting day');
    }
    if (photography) {
      const used = await this._repository.sumGroupSizeForDay('photography', excludeId);
      if (used + addingCount > maxVisitors) throw new BadRequestException('Not enough spots for photography day');
    }
  }
}
