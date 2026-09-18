import type { Project, Devlog, Illustration, CreateProjectInput } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error [${response.status}]: ${errorBody || response.statusText}`);
  }

  // Tangani respons 204 No Content (saat DELETE)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const projectService = {
  getAll: () => request<Project[]>('/projects'),
  getBySlug: (slug: string) => request<Project>(`/projects/${slug}`),
  create: (data: CreateProjectInput) =>
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  // PUT untuk update data proyek
  update: (id: string, data: CreateProjectInput) =>
    request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  // DELETE untuk menghapus proyek
  delete: (id: string) =>
    request<void>(`/projects/${id}`, {
      method: 'DELETE',
    }),
};

export const devlogService = {
  getAll: (projectId?: string) =>
    request<Devlog[]>(`/devlogs${projectId ? `?projectId=${projectId}` : ''}`),
  getBySlug: (slug: string) => request<Devlog>(`/devlogs/${slug}`),
};

export const illustrationService = {
  getAll: () => request<Illustration[]>('/illustrations'),
};