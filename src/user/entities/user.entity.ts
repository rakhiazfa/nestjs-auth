export interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  roles?: string[] | [] | null;
  createdAt: Date;
  updatedAt: Date;
}
