import { anonClient, authClient } from './client';
import {
  CreateReportPayload,
  CreateReportResponse,
  TrackReportPayload,
  Report,
} from '../types';

// Reporter endpoints (anonymous - no auth)

export async function createReport(payload: CreateReportPayload): Promise<CreateReportResponse> {
  const response = await anonClient.post('/reports/create', payload);
  return response.data.data;
}

export async function trackReport(payload: TrackReportPayload): Promise<Report> {
  const response = await anonClient.post('/reports/track', payload);
  return response.data.data;
}

// Authority endpoints (authenticated)

export async function getAllReports(params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  searchTerm?: string;
}) {
  const response = await authClient.get('/reports/all', { params });
  return response.data;
}

export async function getReportById(id: string) {
  const response = await authClient.get(`/reports/${id}`);
  return response.data.data;
}

export async function updateReportStatus(
  id: string,
  payload: { status?: string; authorityNote?: string }
) {
  const response = await authClient.patch(`/reports/${id}`, payload);
  return response.data.data;
}
