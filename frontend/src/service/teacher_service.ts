// services/teacherService.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchTeachers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const addTeacher = async (teacherData: {
  name: string;
  email: string;
  subject: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/teachers`, teacherData);
    return response.data;
  } catch (error) {
    console.error("Error adding teacher:", error);
    throw error;
  }
};
export const updateTeacher = async (id: string, teacherData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/teachers/${id}`, teacherData);
    return response.data;
  }
  catch (error) { 
    console.error("Error updating teacher:", error);
    throw error;
  }
};
export const deleteTeacher = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/auth/users/${id}`);
    return response.data;
  }
  catch (error) {
    console.error("Error deleting teacher:", error);
    throw error;
  }
};
export const getTeacherById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher by ID:", error);
    throw error;
  }
};
export const getTeacherByEmail = async (email: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/users?email=${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher by email:", error);
    throw error;
  }
};
export const getTeacherByPhone = async (phone: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/users?phone=${phone}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher by phone:", error);
    throw error;
  }
};
export const getTeacherByName = async (name: string) => { 
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/users?name=${name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher by name:", error);
    throw error;
  }
}
export const getTeacherBySubject = async (subject: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/users?subject=${subject}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher by subject:", error);
    throw error;
  }
}

// Add more CRUD operations as needed
