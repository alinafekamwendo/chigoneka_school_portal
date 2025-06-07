import axios from "axios";
import {Teacher} from "../types/teacher"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


// Interface for the data required to create a new teacher
export interface CreateTeacherData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string; // Password might be required for user creation part
  phone?: string;
  address?: string;
  sex?: "Male" | "Female";
  qualifications?: string[];
  subjects?: string[];
  profilePhoto?: string;
}

// Interface for the data required to update an existing teacher
export interface UpdateTeacherData {
  firstName?: string;
  lastName?: string;
  username?: string; // Username typically not updated or requires special handling
  email?: string;
  phone?: string;
  address?: string;
  sex?: "Male" | "Female";
  isActive?:boolean,
  qualifications?: string[];
  subjects?: string[];
  profilePhoto?: string;
}

const teacherService = {
  /**
   * Fetches all teachers from the API.
   * @param token - Authentication token.
   * @returns A promise that resolves to an array of Teacher objects.
   * @throws An error if the API call fails.
   */
  getAllTeachers: async (token: string): Promise<Teacher[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/teachers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        switch (status) {
          case 401:
            throw new Error("Unauthorized access: Please log in again.");
          case 403:
            throw new Error(
              "Forbidden: You do not have permission to view teachers.",
            );
          case 404:
            throw new Error("No teachers found.");
          default:
            throw new Error(
              error.response.data.message || "Failed to fetch teachers.",
            );
        }
      }
      throw new Error("An unexpected error occurred while fetching teachers.");
    }
  },

  /**
   * Fetches a single teacher by their ID.
   * @param id - The ID of the teacher to fetch.
   * @param token - Authentication token.
   * @returns A promise that resolves to a Teacher object.
   * @throws An error if the teacher is not found or the API call fails.
   */
  getTeacherById: async (id: string, token: string): Promise<Teacher> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/teachers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        switch (status) {
          case 401:
            throw new Error("Unauthorized access: Please log in again.");
          case 403:
            throw new Error(
              "Forbidden: You do not have permission to view this teacher.",
            );
          case 404:
            throw new Error("Teacher not found.");
          default:
            throw new Error(
              error.response.data.message ||
                `Failed to fetch teacher with ID: ${id}.`,
            );
        }
      }
      throw new Error(
        "An unexpected error occurred while fetching the teacher.",
      );
    }
  },

  /**
   * Creates a new teacher.
   * @param data - The data for creating the teacher.
   * @param token - Authentication token.
   * @returns A promise that resolves to the created Teacher object.
   * @throws An error if the creation fails (e.g., validation errors, unique constraint).
   */
  createTeacher: async (
    data: CreateTeacherData,
    token: string,
  ): Promise<Teacher> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/teachers`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error ||
            error.response.data.message ||
            "Failed to create teacher.",
        );
      }
      throw new Error(
        "An unexpected error occurred while creating the teacher.",
      );
    }
  },

  /**
   * Updates an existing teacher's information.
   * @param id - The ID of the teacher to update.
   * @param data - The data to update.
   * @param token - Authentication token.
   * @returns A promise that resolves to the updated Teacher object.
   * @throws An error if the update fails.
   */
  updateTeacher: async (
    id: string,
    data: UpdateTeacherData,
    token: string,
  ): Promise<Teacher> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/teachers/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error ||
            error.response.data.message ||
            `Failed to update teacher with ID: ${id}.`,
        );
      }
      throw new Error(
        "An unexpected error occurred while updating the teacher.",
      );
    }
  },

  /**
   * Deletes a teacher.
   * @param id - The ID of the teacher to delete.
   * @param token - Authentication token.
   * @returns A promise that resolves when the deletion is successful.
   * @throws An error if the deletion fails.
   */
  deleteTeacher: async (id: string, token: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/teachers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error ||
            error.response.data.message ||
            `Failed to delete teacher with ID: ${id}.`,
        );
      }
      throw new Error(
        "An unexpected error occurred while deleting the teacher.",
      );
    }
  },
  updateUser: async (userId: string, data: any, token: string) => {
    await axios.patch(`${API_BASE_URL}/auth/users/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default teacherService;
