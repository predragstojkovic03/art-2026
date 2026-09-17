import { useMutation } from '@tanstack/react-query';
import { ICreateRegistration } from '@art-2026/shared';
import { useServices } from '@/app/service-container';

export function useCreateRegistration() {
  const { registrationService } = useServices();
  return useMutation({
    mutationFn: (data: ICreateRegistration) => registrationService.create(data),
  });
}
