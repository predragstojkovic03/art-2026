import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('event_config')
export class EventConfigPersistence {
  @PrimaryColumn({ type: 'varchar' })
  key!: string;

  @Column({ type: 'varchar' })
  value!: string;
}
