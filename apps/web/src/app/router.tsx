import { Route, Routes } from 'react-router-dom';
import { EventInfoPage } from '@/features/event-info/presentation/pages/event-info.page';
import { RegisterPage } from '@/features/registrations/presentation/pages/register.page';
import { ManagePage } from '@/features/registrations/presentation/pages/manage.page';
import { RegistrationDetailPage } from '@/features/registrations/presentation/pages/registration-detail.page';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<EventInfoPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/manage" element={<ManagePage />} />
      <Route path="/manage/:token" element={<RegistrationDetailPage />} />
    </Routes>
  );
}
