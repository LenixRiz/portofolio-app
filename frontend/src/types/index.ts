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
  isOnGoing: boolean;
  isFinished: boolean;
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

export interface CreateProjectInput {
  title: string;
  summary: string;
  description: string;
  thumbnailUrl: string;
  repositoryUrl?: string | null;
  demoUrl?: string | null;
  isFeatured: boolean;
  isOnGoing: boolean;
  isFinished: boolean;
  tagNames: string[];
}

export interface Illustration {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  thumbnailUrl: string;
  completedAt?: string | null;
  createdAt: string;
  tags: string[];
}

export interface CreateIllustrationInput {
  title: string;
  description?: string | null;
  imageUrl: string;
  thumbnailUrl?: string;
  completedAt?: string | null;
  tagNames: string[];
}

export interface CreateDevlogInput {
  title: string;
  content: string;
  isPublished: boolean;
  projectId: string;
  tagNames: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  budget?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface CreateContactMessageInput {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  budget?: string | null;
}