import { useQuery } from '@tanstack/react-query';
import { useServices } from '@/app/service-container';

export function useEventInfo() {
  const { eventInfoService } = useServices();
  return useQuery({
    queryKey: ['event-info'],
    queryFn: () => eventInfoService.getEventInfo(),
  });
}
