export type PostVisibility = "public" | "private";

/** posts 테이블 원본 타입 */
export interface DbPost {
  id: number;
  author_id: string;
  category_id: number;
  title: string;
  slug: string;
  content_md: string;
  summary: string | null;
  thumbnail_url: string | null;
  visibility: PostVisibility;
  is_deleted: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

/** 목록 화면용 타입 */
export interface PostListItem extends DbPost {
  author_name: string | null;
  category_name: string | null;
  parent_category_name: string | null;
}

export interface CreatePostBody {
  category_id: number;
  title: string;
  slug: string;
  content_md: string;
  summary?: string | null;
  thumbnail_url?: string | null;
  visibility?: PostVisibility;
}
