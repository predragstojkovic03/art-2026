import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '@/app/service-container';

export function useCancelRegistration(token: string, email: string) {
  const { registrationService } = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => registrationService.cancel(token, email),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registration', token, email] });
      qc.invalidateQueries({ queryKey: ['event-info'] });
    },
  });
}
