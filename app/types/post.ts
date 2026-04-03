export type PostStatus = "draft" | "published" | "archived";

export interface PostItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  categoryId: number | null;
  categoryName: string;
  status: PostStatus;
  isPinned: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostForm {
  id?: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  categoryId: number | null;
  status: PostStatus;
  isPinned: boolean;
}
