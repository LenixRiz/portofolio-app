import type { 
  Project, 
  Devlog, 
  Illustration, 
  CreateProjectInput, 
  CreateIllustrationInput,
  CreateDevlogInput, 
  ContactMessage,
  CreateContactMessageInput
} from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('admin_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  // Sisipkan token JWT jika tersimpan di local storage
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Jika server mengembalikan 401 Unauthorized, bersihkan token kadaluarsa
  if (response.status === 401) {
    localStorage.removeItem('admin_token');
    if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login';
    }
  }

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

export const authService = {
  login: async (credentials: { username: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Gagal login.');
    }

    const data: { token: string; expiresAt: string } = await res.json();
    localStorage.setItem('admin_token', data.token);
    return data;
  },
  logout: () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('admin_token');
  }
};

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
  create: (data: CreateDevlogInput) =>
    request<Devlog>('/devlogs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: CreateDevlogInput) =>
    request<Devlog>(`/devlogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/devlogs/${id}`, {
      method: 'DELETE',
    }),
};

export const illustrationService = {
  getAll: () => request<Illustration[]>('/illustrations'),
  create: (data: CreateIllustrationInput) =>
    request<Illustration>('/illustrations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: CreateIllustrationInput) =>
    request<Illustration>(`/illustrations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/illustrations/${id}`, {
      method: 'DELETE',
    }),
};

export const uploadService = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Catatan: Jangan tambahkan 'Content-Type': 'application/json' 
    // karena browser akan mengatur multipart boundary secara otomatis.

    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Gagal mengunggah gambar.');
    }

    return response.json() as Promise<{ url: string }>;
  },
};

export const messageService = {
  send: (data: CreateContactMessageInput) =>
    request<ContactMessage>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAll: () => request<ContactMessage[]>('/messages'),
  toggleRead: (id: string) =>
    request<{ isRead: boolean }>(`/messages/${id}/toggle-read`, {
      method: 'PATCH',
    }),
  delete: (id: string) =>
    request<void>(`/messages/${id}`, {
      method: 'DELETE',
    }),
};