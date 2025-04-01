import { store } from "./store/store";

declare global {
  type RootState = ReturnType<typeof store.getState>;
  type AppDispatch = typeof store.dispatch;
  type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
  >;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  productId: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  status: "pending" | "completed" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}
