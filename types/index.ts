export type Role = "CUSTOMER" | "SELLER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: string;
}
