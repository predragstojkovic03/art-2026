import {
  ICreateRegistration,
  IRegistrationResponse,
  IUpdateRegistration,
} from '@art-2026/shared';
import { HttpClient } from '@/shared/infrastructure/http/http-client';
import type { IRegistrationService } from '../domain/registration-service.interface';

export class RegistrationService implements IRegistrationService {
  constructor(private readonly _http: HttpClient) {}

  create(data: ICreateRegistration): Promise<IRegistrationResponse> {
    return this._http.post<ICreateRegistration, IRegistrationResponse>('/registrations', data);
  }

  getByToken(token: string, email: string): Promise<IRegistrationResponse> {
    return this._http.get<IRegistrationResponse>(`/registrations/${token}`, { email });
  }

  update(token: string, email: string, data: IUpdateRegistration): Promise<IRegistrationResponse> {
    return this._http.patch<IUpdateRegistration, IRegistrationResponse>(
      `/registrations/${token}`,
      data,
      { email },
    );
  }

  cancel(token: string, email: string): Promise<IRegistrationResponse> {
    return this._http.delete<IRegistrationResponse>(`/registrations/${token}`, { email });
  }
}
