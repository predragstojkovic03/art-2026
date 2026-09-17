import { Entity } from '../../../shared/domain/entity.base';
import { EventDay } from '@art-2026/shared';

interface CreateProps {
  day: EventDay;
  name: string;
  artist: string;
  openingTime: string;
  closingTime: string;
}

interface ReconstituteProps extends CreateProps {
  id: number;
}

export class Exhibition extends Entity<number> {
  private constructor(
    private readonly _id: number,
    private readonly _day: EventDay,
    private readonly _name: string,
    private readonly _artist: string,
    private readonly _openingTime: string,
    private readonly _closingTime: string,
  ) {
    super();
  }

  get id(): number { return this._id; }
  get day(): EventDay { return this._day; }
  get name(): string { return this._name; }
  get artist(): string { return this._artist; }
  get openingTime(): string { return this._openingTime; }
  get closingTime(): string { return this._closingTime; }

  public static create(props: CreateProps): Exhibition {
    return new Exhibition(0, props.day, props.name, props.artist, props.openingTime, props.closingTime);
  }

  public static reconstitute(props: ReconstituteProps): Exhibition {
    return new Exhibition(props.id, props.day, props.name, props.artist, props.openingTime, props.closingTime);
  }
}
