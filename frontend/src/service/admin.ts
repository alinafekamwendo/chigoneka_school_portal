import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Admin {
  id: string;
  userId: string;
  level: "regular" | "super";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone?: string;
    sex?: "MALE" | "FEMALE";
    address?: string;
  };
}

interface CreateAdminData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  sex?: "MALE" | "FEMOTE";
  address?: string;
  level: "regular" | "super";
}

interface UpdateAdminData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phone?: string;
  sex?: "MALE" | "FEMOTE";
  address?: string;
  level?: "regular" | "super";
}

const adminService = {
  // Get all admins
  getAllAdmins: async (token: string): Promise<Admin[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const status =error.status;
      switch (status) {
        case 401: 
          throw new Error("Unauthorized access");
        case 403: 
          throw new Error("Forbidden access");
        case 404:
          throw new Error("Admins not found");
        case 500:
          throw new Error("Internal server error");
        default:
          throw new Error("Failed to fetch admins");
      }
    }
  },

  // Get admin by ID
  getAdminById: async (id: string, token: string): Promise<Admin> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admins/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch admin");
    }
  },

  // Get admin by user ID
  getUserById: async (userId: string, token: string): Promise<Admin> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/auth/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch admin by user ID");
    }
  },

  // Create new admin
  createAdmin: async (data: CreateAdminData, token: string): Promise<Admin> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admins`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to create admin",
        );
      }
      throw new Error("Failed to create admin");
    }
  },

  // Update admin
  updateAdmin: async (
    id: string,
    data: UpdateAdminData,
    token: string,
  ): Promise<Admin> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admins/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to update admin",
        );
      }
      throw new Error("Failed to update admin");
    }
  },

  // Delete admin (soft delete)
  deleteAdmin: async (id: string, token: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/admins/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to delete admin",
        );
      }
      throw new Error("Failed to delete admin");
    }
  },

  // Restore admin
  restoreAdmin: async (id: string, token: string): Promise<Admin> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admins/${id}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to restore admin",
        );
      }
      throw new Error("Failed to restore admin");
    }
  },

  // Promote admin to super admin
  promoteToSuperAdmin: async (id: string, token: string): Promise<Admin> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admins/${id}/promote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to promote admin",
        );
      }
      throw new Error("Failed to promote admin");
    }
  },

  // Demote admin to regular admin
  demoteToRegularAdmin: async (id: string, token: string): Promise<Admin> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admins/${id}/demote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to demote admin",
        );
      }
      throw new Error("Failed to demote admin");
    }
  },
};

export default adminService;
