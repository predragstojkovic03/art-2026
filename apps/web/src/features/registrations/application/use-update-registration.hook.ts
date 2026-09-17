import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IUpdateRegistration } from '@art-2026/shared';
import { useServices } from '@/app/service-container';

export function useUpdateRegistration(token: string, email: string) {
  const { registrationService } = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: IUpdateRegistration) => registrationService.update(token, email, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registration', token, email] });
      qc.invalidateQueries({ queryKey: ['event-info'] });
    },
  });
}
