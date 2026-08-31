import { anonClient } from './client';

export type FileUploadResponse = {
  storageKey: string;
};

export async function uploadFile(uri: string, fileName: string, mimeType: string): Promise<FileUploadResponse> {
  const formData = new FormData();
  
  formData.append('file', {
    uri,
    name: fileName,
    type: mimeType,
  } as any);

  const response = await anonClient.post('/file-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
}
