import { createContext, useContext } from 'react';
import type { IEventInfoService } from '@/features/event-info/domain/event-info-service.interface';
import type { IRegistrationService } from '@/features/registrations/domain/registration-service.interface';

export interface ServiceContainer {
  eventInfoService: IEventInfoService;
  registrationService: IRegistrationService;
}

const ServiceContext = createContext<ServiceContainer | null>(null);

export const ServiceProvider = ServiceContext.Provider;

export function useServices(): ServiceContainer {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('useServices must be used inside <ServiceProvider>');
  return ctx;
}
