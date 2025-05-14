import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Configure axios to include credentials for session management
axios.defaults.withCredentials = true;

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "teacher" | "parent" | "student";
  name: string;
  // Add other user fields as needed
}

export interface LoginResponse {
  user: User;
  token?: string;
  message: string;
}

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials,
    );
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = async (): Promise<{ message: string }> => {
  try {
    // Clear tokens first to prevent any subsequent requests
    clearTokens();
    delete axios.defaults.headers.common["Authorization"];

    // Then call server logout
    const response = await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    // Ensure cleanup even if server logout fails
    clearTokens();
    delete axios.defaults.headers.common["Authorization"];
    throw error;
  }
};

export const signup = async (userData: {
  username: string;
  password: string;
  email: string;
  name: string;
  role: string;
}): Promise<User> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/current-user`,
      {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

export const updateUser = async (
  id: string,
  userData: Partial<User>,
): Promise<User> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/auth/users/${id}`,
      userData,
    );
    return response.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/auth/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};

export const restoreUser = async (id: string): Promise<User> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/users/${id}/restore`,
    );
    return response.data;
  } catch (error) {
    console.error("Restore user error:", error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/users`);
    return response.data;
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get user by ID error:", error);
    throw error;
  }
};

// Utility function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    // Then check with server
    await axios.get(`${API_BASE_URL}/auth/current-user`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return true;
  } catch (error) {
    clearTokens();
    return false;
  }
};

// Utility function to check user role
export const hasRole = async (role: string): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return user?.role === role;
  } catch (error) {
    return false;
  }
};

// Add these to your authService
export const storeTokens = (accessToken: string) => {
  localStorage.setItem("access_token", accessToken);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
};

// Add interceptors to handle token refresh if using JWT


let refreshCount = 0;
const MAX_REFRESH_ATTEMPTS = 3;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for the shouldLogout flag first
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (error.response?.data?.shouldLogout) {
        await logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    // Proceed with refresh token attempt only if shouldLogout is not true and it's a 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (refreshCount >= MAX_REFRESH_ATTEMPTS) {
        await logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      refreshCount++;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          },
        );

        const newToken = refreshResponse.data.token;
        storeTokens(newToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        refreshCount = 0; // Reset on success

        return axios(originalRequest);
      } catch (refreshError) {
        await logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);