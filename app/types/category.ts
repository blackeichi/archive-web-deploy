export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_guest_room: boolean;
  sort_order: number;
  parent_id: number | null;
  type: "root" | "child";
}
export interface CategoryTreeItem {
  id: number;
  name: string;
  slug: string;
  type: "root" | "child";
  parent_id: number | null;
  sort_order: number;
  children: CategoryTreeItem[];
}
