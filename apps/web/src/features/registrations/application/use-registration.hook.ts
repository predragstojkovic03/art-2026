import { useQuery } from '@tanstack/react-query';
import { useServices } from '@/app/service-container';

export function useRegistration(token: string | undefined, email: string | null) {
  const { registrationService } = useServices();
  return useQuery({
    queryKey: ['registration', token, email],
    queryFn: () => registrationService.getByToken(token!, email!),
    enabled: !!token && !!email,
  });
}
