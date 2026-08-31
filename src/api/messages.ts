import { anonClient, authClient } from './client';
import { Message } from '../types';

// Reporter endpoints (anonymous)

export async function getReporterThread(passcode: string): Promise<Message[]> {
  const response = await anonClient.post('/messages/thread', { passcode });
  return response.data.data;
}

export async function sendReporterMessage(passcode: string, body: string): Promise<Message> {
  const response = await anonClient.post('/messages/send', { passcode, body });
  return response.data.data;
}

// Authority endpoints (authenticated)

export async function getAuthorityThread(reportId: string): Promise<Message[]> {
  const response = await authClient.get(`/messages/${reportId}`);
  return response.data.data;
}

export async function sendAuthorityMessage(reportId: string, body: string): Promise<Message> {
  const response = await authClient.post(`/messages/${reportId}`, { body });
  return response.data.data;
}
