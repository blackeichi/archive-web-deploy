export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  visible: boolean;
  order: number;
}

export interface CategoryGroup extends CategoryItem {
  children: CategoryItem[];
}

export interface CategoryForm {
  id?: number;
  parentId: number | null;
  name: string;
  slug: string;
  description: string;
  visible: boolean;
  order: number;
}
