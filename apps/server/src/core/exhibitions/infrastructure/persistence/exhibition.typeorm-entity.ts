import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('exhibitions')
export class ExhibitionPersistence {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'int' })
  day!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  artist!: string;

  @Column({ type: 'time', name: 'opening_time' })
  openingTime!: string;

  @Column({ type: 'time', name: 'closing_time' })
  closingTime!: string;
}
