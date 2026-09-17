import {
  ICreateRegistration,
  IRegistrationResponse,
  IUpdateRegistration,
} from '@art-2026/shared';

export interface IRegistrationService {
  create(data: ICreateRegistration): Promise<IRegistrationResponse>;
  getByToken(token: string, email: string): Promise<IRegistrationResponse>;
  update(token: string, email: string, data: IUpdateRegistration): Promise<IRegistrationResponse>;
  cancel(token: string, email: string): Promise<IRegistrationResponse>;
}
