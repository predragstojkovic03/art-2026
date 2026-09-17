export abstract class Entity<TId = number> {
  public abstract readonly id: TId;
}
