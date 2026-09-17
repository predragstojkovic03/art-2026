import { Module } from '@nestjs/common';
import { EventConfigModule } from '../event-config/event-config.module';
import { ExhibitionsModule } from '../exhibitions/exhibitions.module';
import { RegistrationsModule } from '../registrations/registrations.module';
import { EventInfoService } from './application/event-info.service';
import { EventInfoController } from './presentation/rest/event-info.controller';

@Module({
  imports: [EventConfigModule, ExhibitionsModule, RegistrationsModule],
  controllers: [EventInfoController],
  providers: [EventInfoService],
})
export class EventInfoModule {}
