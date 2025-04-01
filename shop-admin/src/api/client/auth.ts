import { AuthResponse } from "../../types";

const API_URL = "/api/auth";

export const registerUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Failed to register");
  return response.json();
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Failed to login");
  return response.json();
};

export const logoutUser = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to logout");
};
