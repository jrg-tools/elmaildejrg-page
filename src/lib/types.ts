export interface Newsletter {
  id: string;
  slug: string;
  content: string;
  blocks: object;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
