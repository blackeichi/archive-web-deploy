export interface CategoryTreeNode {
  id: number;
  parent_id: number | null;
  type: "root" | "child";
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_guest_room: boolean;
  created_at: string;
  updated_at: string;
  children?: CategoryTreeNode[];
}
