export interface BlogDocument {
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  externalUrl?: string;
  type: string;
  draft: boolean;
  views: number;
  likes: number;
  slug: string;
  tags: string[];
  author: string;
  readTime: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
  linkedinUrl?: string;
  email?: string;
}

export interface PracticeArea {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  iconName?: string;
}
