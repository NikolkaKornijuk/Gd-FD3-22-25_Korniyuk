import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../types";
import { db } from "../../api/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

interface Order {
  id: string;
  productId: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  status: "pending" | "completed" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
}

interface OrdersState {
  items: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    fetchOrdersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess(state, action: PayloadAction<Order[]>) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchOrdersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addOrderStart(state) {
      state.loading = true;
      state.error = null;
    },
    addOrderSuccess(state, action: PayloadAction<Order>) {
      state.items.push(action.payload);
      state.loading = false;
    },
    addOrderFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateOrderStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateOrderSuccess(state, action: PayloadAction<Order>) {
      const index = state.items.findIndex(
        (order) => order.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.loading = false;
    },
    updateOrderFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteOrderStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteOrderSuccess(state, action: PayloadAction<string>) {
      state.items = state.items.filter((order) => order.id !== action.payload);
      state.loading = false;
    },
    deleteOrderFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  addOrderStart,
  addOrderSuccess,
  addOrderFailure,
  updateOrderStart,
  updateOrderSuccess,
  updateOrderFailure,
  deleteOrderStart,
  deleteOrderSuccess,
  deleteOrderFailure,
} = ordersSlice.actions;

export default ordersSlice.reducer;

const transformOrderData = (data: any): Order => {
  return {
    id: data.id,
    productId: data.productId,
    quantity: data.quantity,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    status: data.status,
    createdAt: data.createdAt?.toDate().toISOString(),
    updatedAt: data.updatedAt?.toDate().toISOString(),
  };
};

export const fetchOrders = (): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchOrdersStart());
    const querySnapshot = await getDocs(collection(db, "orders"));
    const orders = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return transformOrderData({
        id: doc.id,
        ...data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });
    dispatch(fetchOrdersSuccess(orders));
  } catch (error: any) {
    dispatch(fetchOrdersFailure(error.message || "Failed to fetch orders"));
  }
};

export const deleteOrder =
  (id: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(deleteOrderStart());
      await deleteDoc(doc(db, "orders", id));
      dispatch(deleteOrderSuccess(id));
    } catch (error: any) {
      dispatch(deleteOrderFailure(error.message || "Failed to delete order"));
      console.error("Error deleting order:", error);
    }
  };
