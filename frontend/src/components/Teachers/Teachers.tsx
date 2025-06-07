// app/teachers/teachers/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import teacherService from "@/service/teacher_service";
import MyDataTable from "@/components/Tables/MyDataTable";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { LuUserPlus } from "react-icons/lu";
import { teacherColumns } from "./teacherColumns";
import {DataTable as TeacherDataTable} from "@/components/Tables/Custom/data-table";
import {Teacher} from "../../types/teacher"


const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No authentication token found");

      const teachersData = await teacherService.getAllTeachers(token);
  
      setTeachers(teachersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleView = (item: any) => {
    router.push(`/dashboard/admin/teachers/view/${item.rawData.id}`);
  };

  const handleEdit = (item: any) => {
    router.push(`/dashboard/admin/teachers/edit/${item.rawData.id}`);
  };

  const handleDelete = async (item: any) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No authentication token found");

      await teacherService.deleteTeacher(item.id, token);
      toast({
        title: "Teacher deleted",
        description: "The teacher has been successfully deleted.",
        duration: 3000,
      });
      await fetchTeachers(); // Refresh the data
    } catch (error) {
      toast({
        title:
          error instanceof Error ? error.message : "Failed to delete teacher",
        description: "Please try again later.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  console.log("Teachers data:", teachers);
  console.log("teacher columns",teacherColumns)
  // Transform teacher data for the table
  const tableData = teachers.map((teacher) => ({
    id: teacher.id,
    staffNumber: teacher.staffNumber,
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    phone: teacher.phone || "N/A",
    email: teacher.email,
    username: teacher.username,
    sex: teacher.sex || "N/A",
    isActive:teacher.isActive? "Active" : "InActive",
    address: teacher.address || "N/A",
    qualifications: teacher.qualifications.join(", "),
    subjects: teacher.subjects.join(", "),
    deletedAt: new Date(teacher.deletedAt || "").toLocaleDateString(),
    profilePhoto: teacher.profilePhoto || "https://via.placeholder.com/150",
    createdAt: new Date(teacher.createdAt).toLocaleDateString(),
    updatedAt: new Date(teacher.updatedAt).toLocaleDateString(),

  }));

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-2">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <Button
          className="bg-blue-600  text-white hover:bg-blue-700"
          onClick={() => router.push("/dashboard/admin/teachers/add")}
        >
          <LuUserPlus />
        </Button>
      </div>

     <TeacherDataTable
            data={tableData}
            columns={teacherColumns}
            filterableColumns={["email", "username", "role"]}
          />
    </div>
  );
};

export default TeachersPage;
