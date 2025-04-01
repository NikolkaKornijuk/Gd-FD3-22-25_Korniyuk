import { Order } from "../../types";

const API_URL = "http://localhost:5000/api/orders";

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
};

export const addOrder = async (
  orderData: Omit<Order, "id">
): Promise<{ id: string }> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error("Failed to add order");
  return response.json();
};

export const updateOrder = async (
  id: string,
  orderData: Partial<Order>
): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error("Failed to update order");
};

export const deleteOrder = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete order");
};
