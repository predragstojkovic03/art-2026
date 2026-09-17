import { Entity } from '../../../shared/domain/entity.base';

interface EventConfigProps {
  key: string;
  value: string;
}

export class EventConfig extends Entity<string> {
  private constructor(private readonly _key: string, private _value: string) {
    super();
  }

  public get id(): string {
    return this._key;
  }

  public get key(): string {
    return this._key;
  }

  public get value(): string {
    return this._value;
  }

  public setValue(value: string): void {
    this._value = value;
  }

  public static create(props: EventConfigProps): EventConfig {
    return new EventConfig(props.key, props.value);
  }

  public static reconstitute(props: EventConfigProps): EventConfig {
    return new EventConfig(props.key, props.value);
  }
}
