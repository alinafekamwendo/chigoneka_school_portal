// app/teachers/teachers/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import teacherService from "@/service/teacher_service";
import MyDataTable from "@/components/Tables/MyDataTable";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface Teacher {
  id: string;
  userId: string;
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
    sex?: "MALE" | "FEMALE";
    address?: string;
    profilePhoto?: string;
}

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

      await teacherService.deleteTeacher(item.rawData.id, token);
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
  // Transform teacher data for the table
  const tableData = teachers.map((teacher) => ({
    id: teacher.id,
    name: `${teacher.firstName} ${teacher.lastName}`,
    email: teacher.email,
    username: teacher.username,
    qualifications: teacher.qualifications.join(", "),
    subjects: teacher.subjects.join(", "),
    status: teacher.deletedAt ? "Inactive" : "Active",
    createdAt: new Date(teacher.createdAt).toLocaleDateString(),
    rawData: teacher,
  }));

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-2">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <Button onClick={() => router.push("/dashboard/teachers/add")}>
          Add New Teacher
        </Button>
      </div>

      <MyDataTable
        data={tableData}
        columns={[
          {
            key: "name",
            label: "Name",
            isSortable: true,
            isFilterable: true,
          },
          {
            key: "email",
            label: "Email",
            isSortable: true,
            isFilterable: true,
          },
          // {
          //   key: "username",
          //   label: "Username",
          //   isSortable: true,
          // },
          {
            key: "qualifications",
            label: "Qualifications",
            isSortable: false,
          },
          {
            key: "subjects",
            label: "Subjects",
            isSortable: false,
          },
          {
            key: "createdAt",
            label: "Created At",
            isSortable: true,
          },
          {
            key: "status",
            label: "Status",
            isSortable: true,
            isFilterable: true,
            filterType: "select",
            filterOptions: ["Active", "Inactive"],
          },
        ]}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        className="h-full w-full"
      />
    </div>
  );
};

export default TeachersPage;
