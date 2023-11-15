export class Role {
  id: number;
  name: string;
  permissions?: string[] | [] | null;
  createdAt: Date;
  updatedAt: Date;
}
