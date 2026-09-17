export abstract class Mapper<Domain, Persistence> {
  abstract toDomain(entity: Persistence): Domain;
  abstract toPersistence(domain: Domain): Persistence;

  toDomainList(list: Persistence[]): Domain[] {
    return list.map((item) => this.toDomain(item));
  }

  toPersistenceList(list: Domain[]): Persistence[] {
    return list.map((item) => this.toPersistence(item));
  }
}
