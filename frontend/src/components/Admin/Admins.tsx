// app/admin/admins/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import adminService from "@/service/admin";
import MyDataTable from "@/components/Tables/MyDataTable";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import DataTable from "@/components/Tables/Custom/DataTable";
import {DataTable as AdminDataTable} from "@/components/Tables/Custom/data-table";
import { adminColumns } from "./adminColumns";
import { LuUserPlus } from "react-icons/lu";

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
    profilePhoto?: string;
  };
}

const AdminsPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();


  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No authentication token found");

      const adminsData = await adminService.getAllAdmins(token);
      setAdmins(adminsData);
     
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

 
  const handleView = (item: any) => {
    router.push(`/dashboard/admin/admins/view/${item.rawData.id}`);
  };

  const handleEdit = (item: any) => {
    router.push(`/dashboard/admin/admins/edit/${item.rawData.id}`);
  };

  const handleDelete = async (item: any) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No authentication token found");

      await adminService.deleteAdmin(item.rawData.id, token);
      toast({
        title: "Admin deleted",
        description: "The admin has been successfully deleted.",
        duration: 3000,
      });
      await fetchAdmins(); // Refresh the data
    } catch (error) {
      toast({
        title:
          error instanceof Error ? error.message : "Failed to delete admin",
        description: "Please try again later.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  // Transform admin data for the table
  const tableData = admins.map((admin) => ({
    id: admin.id,
    name: `${admin.user.firstName} ${admin.user.lastName}`,
    email: admin.user.email,
    username: admin.user.username,
    role: admin.level === "super" ? "Super Admin" : "Regular Admin",
    status: admin.deletedAt ? "Inactive" : "Active",
    createdAt: new Date(admin.createdAt).toLocaleDateString(),
    rawData: admin,
  }));

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Admins</h1>
        <Button
          onClick={() => router.push("/dashboard/admin/admins/add")}
          className="bg-blue-500  text-white hover:bg-blue-600"
        >
         <LuUserPlus />
        </Button>
      </div>
      {/* <MyDataTable
        data={tableData}
        columns={[
          {
            key: "email",
            label: "Email",
            isSortable: true,
            isFilterable: true,
          },
          {
            key: "username",
            label: "Username",
            isSortable: true,
          },
          {
            key: "role",
            label: "Level",
            isSortable: true,
            isFilterable: true,
            filterType: "select",
            filterOptions: ["Super Admin", "Regular Admin"],
            
          },
          {
            key: "createdAt",
            label: "Created At",
            isSortable: true,
          },
        ]}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        className="h-full w-full"
      /> */}
      <AdminDataTable
        data={tableData}
        columns={adminColumns}
        filterableColumns={["email", "username", "role"]}
      />
    </div>
  );
};

export default AdminsPage;
