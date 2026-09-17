import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RegistrationStatus } from '@art-2026/shared';

@Entity('registrations')
export class RegistrationPersistence {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 128 })
  token!: string;

  @Column({ type: 'enum', enum: RegistrationStatus, default: RegistrationStatus.Active })
  status!: RegistrationStatus;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar', name: 'first_name' })
  firstName!: string;

  @Column({ type: 'varchar', name: 'last_name' })
  lastName!: string;

  @Column({ type: 'varchar', nullable: true })
  profession!: string | null;

  @Column({ type: 'varchar' })
  address1!: string;

  @Column({ type: 'varchar', nullable: true })
  address2!: string | null;

  @Column({ type: 'varchar', name: 'postal_code' })
  postalCode!: string;

  @Column({ type: 'varchar' })
  city!: string;

  @Column({ type: 'varchar' })
  country!: string;

  @Column({ type: 'boolean', name: 'painting_day', default: false })
  paintingDay!: boolean;

  @Column({ type: 'boolean', name: 'photography_day', default: false })
  photographyDay!: boolean;

  @Column({ type: 'int', name: 'group_size', default: 1 })
  groupSize!: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 32, name: 'promo_code' })
  promoCode!: string;

  @Column({ type: 'bigint', name: 'referrer_id', nullable: true })
  referrerId!: string | null;

  @Column({ type: 'timestamptz', name: 'promo_code_redeemed_at', nullable: true })
  promoCodeRedeemedAt!: Date | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
  totalAmount!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
