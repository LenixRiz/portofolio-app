export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  thumbnailUrl: string;
  repositoryUrl?: string | null;
  demoUrl?: string | null;
  isFeatured: boolean;
  createdAt: string;
  tags: string[];
}

export interface Devlog {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  projectId: string;
  projectTitle?: string | null;
  tags: string[];
}

export interface Illustration {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  imageUrl: string;
  thumbnailUrl: string;
  completedAt?: string | null;
  createdAt: string;
  tags: string[];
}

export interface CreateProjectInput {
  title: string;
  summary: string;
  description: string;
  thumbnailUrl: string;
  repositoryUrl?: string | null;
  demoUrl?: string | null;
  isFeatured: boolean;
  tagNames: string[];
}