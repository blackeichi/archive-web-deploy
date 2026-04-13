export type CategoryType = "root" | "child";

export interface DbCategory {
  id: number;
  parent_id: number | null;
  type: CategoryType;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_guest_room: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryTreeItem {
  id: number;
  parent_id: number | null;
  type: CategoryType;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_guest_room: boolean;
  children: CategoryTreeItem[];
  directPostCount: number;
  totalPostCount: number;
}

export type CategoryForm = {
  id?: number;
  type: CategoryType;
  parent_id: number | null;
  name: string;
  description: string;
  is_guest_room: boolean;
};

export interface CategoryReorderItem {
  id: number;
  sort_order: number;
}

export interface CategoryReorderGroup {
  parent_id: number | null;
  items: CategoryReorderItem[];
}

export interface CategoryReorderPayload {
  groups: CategoryReorderGroup[];
}
