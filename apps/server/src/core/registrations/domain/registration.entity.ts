import { randomBytes } from 'crypto';
import { RegistrationStatus } from '@art-2026/shared';
import { Entity } from '../../../shared/domain/entity.base';

export interface CreateRegistrationProps {
  email: string;
  firstName: string;
  lastName: string;
  profession: string | null;
  address1: string;
  address2: string | null;
  postalCode: string;
  city: string;
  country: string;
  paintingDay: boolean;
  photographyDay: boolean;
  groupSize: number;
  referrerId: number | null;
  totalAmount: number;
}

export interface ReconstituteRegistrationProps extends CreateRegistrationProps {
  id: number;
  token: string;
  status: RegistrationStatus;
  promoCode: string;
  promoCodeRedeemedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Registration extends Entity<number> {
  private constructor(
    private _id: number,
    private _token: string,
    private _status: RegistrationStatus,
    private _email: string,
    private _firstName: string,
    private _lastName: string,
    private _profession: string | null,
    private _address1: string,
    private _address2: string | null,
    private _postalCode: string,
    private _city: string,
    private _country: string,
    private _paintingDay: boolean,
    private _photographyDay: boolean,
    private _groupSize: number,
    private _promoCode: string,
    private _referrerId: number | null,
    private _promoCodeRedeemedAt: Date | null,
    private _totalAmount: number,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  get id(): number { return this._id; }
  get token(): string { return this._token; }
  get status(): RegistrationStatus { return this._status; }
  get email(): string { return this._email; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get profession(): string | null { return this._profession; }
  get address1(): string { return this._address1; }
  get address2(): string | null { return this._address2; }
  get postalCode(): string { return this._postalCode; }
  get city(): string { return this._city; }
  get country(): string { return this._country; }
  get paintingDay(): boolean { return this._paintingDay; }
  get photographyDay(): boolean { return this._photographyDay; }
  get groupSize(): number { return this._groupSize; }
  get promoCode(): string { return this._promoCode; }
  get referrerId(): number | null { return this._referrerId; }
  get promoCodeRedeemedAt(): Date | null { return this._promoCodeRedeemedAt; }
  get totalAmount(): number { return this._totalAmount; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  updateDays(paintingDay: boolean, photographyDay: boolean): void {
    if (!paintingDay && !photographyDay) {
      throw new Error('At least one day must be selected');
    }
    this._paintingDay = paintingDay;
    this._photographyDay = photographyDay;
    this._updatedAt = new Date();
  }

  updateGroupSize(size: number): void {
    if (size < 1) throw new Error('Group size must be >= 1');
    this._groupSize = size;
    this._updatedAt = new Date();
  }

  updateTotalAmount(amount: number): void {
    this._totalAmount = amount;
    this._updatedAt = new Date();
  }

  cancel(): void {
    if (this._status === RegistrationStatus.Cancelled) throw new Error('Already cancelled');
    this._status = RegistrationStatus.Cancelled;
    this._updatedAt = new Date();
  }

  markPromoCodeRedeemed(at: Date): void {
    this._promoCodeRedeemedAt = at;
    this._updatedAt = at;
  }

  static create(props: CreateRegistrationProps): Registration {
    const token = randomBytes(32).toString('hex');
    const promoCode = randomBytes(4).toString('hex').toUpperCase();
    const now = new Date();
    return new Registration(
      0, token, RegistrationStatus.Active,
      props.email, props.firstName, props.lastName, props.profession,
      props.address1, props.address2, props.postalCode, props.city, props.country,
      props.paintingDay, props.photographyDay, props.groupSize,
      promoCode, props.referrerId, null,
      props.totalAmount, now, now,
    );
  }

  static reconstitute(props: ReconstituteRegistrationProps): Registration {
    return new Registration(
      props.id, props.token, props.status,
      props.email, props.firstName, props.lastName, props.profession,
      props.address1, props.address2, props.postalCode, props.city, props.country,
      props.paintingDay, props.photographyDay, props.groupSize,
      props.promoCode, props.referrerId, props.promoCodeRedeemedAt,
      props.totalAmount, props.createdAt, props.updatedAt,
    );
  }
}
