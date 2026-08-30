import { anonClient, authClient } from './client';
import {
  AuthorityLoginPayload,
  AuthorityLoginResponse,
  AuthorityProfile,
} from '../types';

export async function loginAuthority(payload: AuthorityLoginPayload): Promise<AuthorityLoginResponse> {
  const response = await anonClient.post('/authorities/login', payload);
  return response.data.data;
}

export async function getAuthorityProfile(): Promise<AuthorityProfile> {
  const response = await authClient.get('/authorities/me');
  return response.data.data;
}
