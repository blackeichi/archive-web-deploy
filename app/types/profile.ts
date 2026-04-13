export interface Profile {
  email: string;
  password: string;
  name: string;
  avatar_url?: string;
  role: "admin" | "guest";
}
