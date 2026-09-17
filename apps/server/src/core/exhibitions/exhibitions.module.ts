import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionsService } from './application/exhibitions.service';
import { I_EXHIBITIONS_REPOSITORY } from './domain/exhibitions.repository.interface';
import { ExhibitionTypeOrmMapper } from './infrastructure/persistence/exhibition-typeorm.mapper';
import { ExhibitionsTypeOrmRepository } from './infrastructure/persistence/exhibitions-typeorm.repository';
import { ExhibitionPersistence } from './infrastructure/persistence/exhibition.typeorm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitionPersistence])],
  providers: [
    ExhibitionsService,
    ExhibitionTypeOrmMapper,
    {
      provide: I_EXHIBITIONS_REPOSITORY,
      useClass: ExhibitionsTypeOrmRepository,
    },
  ],
  exports: [ExhibitionsService],
})
export class ExhibitionsModule {}
