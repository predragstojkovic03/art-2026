import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { EventInfoService } from '@/features/event-info/infrastructure/event-info.service';
import { RegistrationService } from '@/features/registrations/infrastructure/registration.service';
import { HttpClient } from '@/shared/infrastructure/http/http-client';
import { ServiceProvider, ServiceContainer } from './service-container';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';
const httpClient = new HttpClient(apiUrl);

const services: ServiceContainer = {
  eventInfoService: new EventInfoService(httpClient),
  registrationService: new RegistrationService(httpClient),
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ServiceProvider value={services}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </ServiceProvider>
  );
}
