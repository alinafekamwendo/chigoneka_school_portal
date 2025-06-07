export type Teacher ={
  id: string;
  staffNumber: string; // The ID of the teacher record itself // The ID of the associated user record
  qualifications: string[];
  subjects: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  dob?: Date;
  isActive?: boolean;
  sex: "Male" | "Female"; // Matching backend definition
  address?: string;
  profilePhoto?: string;
}
