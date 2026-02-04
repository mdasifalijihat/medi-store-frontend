export type Role = "CUSTOMER" | "SELLER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface CartItem {
  id: number;
  medicine: {
    id: number;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

export interface Order {
  id: number;
  status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  address: string;
  totalPrice: number;
  items: {
    medicine: {
      id: number;
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  reviewGiven?: boolean;
}
