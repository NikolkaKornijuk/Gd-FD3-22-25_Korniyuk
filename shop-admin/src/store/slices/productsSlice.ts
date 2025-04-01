import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../types";
import { db } from "../../api/firebase";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Product } from "../../types";

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    fetchProductsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addProductSuccess(state, action: PayloadAction<Product>) {
      state.items.push(action.payload);
    },
    updateProductSuccess(state, action: PayloadAction<Product>) {
      const index = state.items.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteProductSuccess(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (product) => product.id !== action.payload
      );
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  addProductSuccess,
  updateProductSuccess,
  deleteProductSuccess,
} = productsSlice.actions;

export default productsSlice.reducer;

export const fetchProducts = (): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchProductsStart());
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Product)
    );
    dispatch(fetchProductsSuccess(products));
  } catch (error: any) {
    dispatch(fetchProductsFailure(error.message));
  }
};

export const addProduct =
  (productData: Omit<Product, "id">): AppThunk =>
  async (dispatch) => {
    try {
      const docRef = await addDoc(collection(db, "products"), productData);
      dispatch(addProductSuccess({ id: docRef.id, ...productData }));
    } catch (error: any) {
      dispatch(fetchProductsFailure(error.message));
    }
  };

export const updateProduct =
  (id: string, productData: Partial<Omit<Product, "id">>): AppThunk =>
  async (dispatch) => {
    try {
      await updateDoc(doc(db, "products", id), productData);
      dispatch(updateProductSuccess({ id, ...productData } as Product));
    } catch (error: any) {
      dispatch(fetchProductsFailure(error.message));
    }
  };

export const deleteProduct =
  (id: string): AppThunk =>
  async (dispatch) => {
    try {
      await deleteDoc(doc(db, "products", id));
      dispatch(deleteProductSuccess(id));
    } catch (error: any) {
      dispatch(fetchProductsFailure(error.message));
    }
  };
