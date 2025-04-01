import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Хук для доступа к состоянию аутентификации
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

// Хук для доступа к состоянию товаров
export const useProducts = () => {
  return useAppSelector((state) => state.products);
};

// Хук для доступа к состоянию заказов
export const useOrders = () => {
  return useAppSelector((state) => state.orders);
};

// Хук для проверки авторизации пользователя
export const useIsAuthenticated = () => {
  return useAppSelector((state) => state.auth.user !== null);
};

// Хук для получения текущего пользователя
export const useCurrentUser = () => {
  return useAppSelector((state) => state.auth.user);
};
