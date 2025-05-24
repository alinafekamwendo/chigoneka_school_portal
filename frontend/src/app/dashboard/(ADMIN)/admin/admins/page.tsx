"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminDefaultLayout from "@/components/Layouts/AdminDefaultLayout";
import AdminUserDataTable from "@/components/Tables/AdminUserDataTable";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import DatePickerTwo from "@/components/FormElements/DatePicker/DatePickerTwo";
import  MyDataTable  from "@/components/Tables/MyDataTable";
import { cn } from "@/lib/utils";

//data
const initialData = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice.smith@example.com",
    role: "Admin",
    createdAt: "2024-01-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "Editor",
    createdAt: "2024-02-01",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "Viewer",
    createdAt: "2024-03-10",
    status: "Active",
  },
  {
    id: 4,
    name: "Diana Lee",
    email: "diana.lee@example.com",
    role: "Admin",
    createdAt: "2024-04-05",
    status: "Pending",
  },
  {
    id: 5,
    name: "Ethan Miller",
    email: "ethan.miller@example.com",
    role: "Editor",
    createdAt: "2024-05-12",
    status: "Active",
  },
  {
    id: 6,
    name: "Fiona Green",
    email: "fiona.green@example.com",
    role: "Viewer",
    createdAt: "2024-06-20",
    status: "Inactive",
  },
  {
    id: 7,
    name: "George Adams",
    email: "george.adams@example.com",
    role: "Admin",
    createdAt: "2024-07-01",
    status: "Active",
  },
  {
    id: 8,
    name: "Hannah White",
    email: "hannah.white@example.com",
    role: "Editor",
    createdAt: "2024-08-18",
    status: "Pending",
  },
  {
    id: 9,
    name: "Ian Black",
    email: "ian.black@example.com",
    role: "Viewer",
    createdAt: "2024-09-25",
    status: "Active",
  },
  {
    id: 10,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "Admin",
    createdAt: "2024-10-30",
    status: "Inactive",
  },
  {
    id: 11,
    name: "Kevin Hart",
    email: "kevin.hart@example.com",
    role: "Editor",
    createdAt: "2024-11-05",
    status: "Active",
  },
  {
    id: 12,
    name: "Laura Smith",
    email: "laura.smith@example.com",
    role: "Viewer",
    createdAt: "2024-12-12",
    status: "Pending",
  },
];


//
interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  createdAt: string;
  status: "Active" | "Inactive" | "Pending";
}

// Mock Data
const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice.smith@example.com",
    role: "Admin",
    createdAt: "2024-01-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "Editor",
    createdAt: "2024-02-01",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "Viewer",
    createdAt: "2024-03-10",
    status: "Active",
  },
  {
    id: 4,
    name: "Diana Lee",
    email: "diana.lee@example.com",
    role: "Admin",
    createdAt: "2024-04-05",
    status: "Pending",
  },
  {
    id: 5,
    name: "Ethan Miller",
    email: "ethan.miller@example.com",
    role: "Editor",
    createdAt: "2024-05-12",
    status: "Active",
  },
  {
    id: 6,
    name: "Fiona Green",
    email: "fiona.green@example.com",
    role: "Viewer",
    createdAt: "2024-06-20",
    status: "Inactive",
  },
  {
    id: 7,
    name: "George Adams",
    email: "george.adams@example.com",
    role: "Admin",
    createdAt: "2024-07-01",
    status: "Active",
  },
  {
    id: 8,
    name: "Hannah White",
    email: "hannah.white@example.com",
    role: "Editor",
    createdAt: "2024-08-18",
    status: "Pending",
  },
  {
    id: 9,
    name: "Ian Black",
    email: "ian.black@example.com",
    role: "Viewer",
    createdAt: "2024-09-25",
    status: "Active",
  },
  {
    id: 10,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "Admin",
    createdAt: "2024-10-30",
    status: "Inactive",
  },
];
// Column definitions
const userColumns = [
  {
    key: "name",
    label: "Name",
    isSortable: true,
    isFilterable: true,
    filterType: "text" as const,
  },
  {
    key: "email",
    label: "Email",
    isSortable: true,
    isFilterable: true,
    filterType: "text" as const,
  },
  {
    key: "role",
    label: "Role",
    isSortable: true,
    isFilterable: true,
    filterType: "select" as const,
    filterOptions: ["Admin", "Editor", "Viewer"],
  },
  {
    key: "createdAt",
    label: "Created At",
    isSortable: true,
    format: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    key: "status",
    label: "Status",
    isSortable: true,
    isFilterable: true,
    filterType: "select" as const,
    filterOptions: ["Active", "Inactive", "Pending"],
    format: (value: string) => (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          {
            "bg-green-100 text-green-800": value === "Active",
            "bg-red-100 text-red-800": value === "Inactive",
            "bg-yellow-100 text-yellow-800": value === "Pending",
          },
        )}
      >
        {value}
      </span>
    ),
  },
];
export default function Admins() {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Handle errors

  //  const columns = [
  //    { name: "id", label: "id" },
  //    { name: "username", label: "username" },
  //    { name: "email", label: "email" },
  //    { name: "role", label: " role" },
  //    { name: "sex", label: "sex" },
  //    { name: "phone", label: "phone" },
  //  ];
  // Define the type for our data

  // Define base columns
  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "username", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "role", headerName: "Role", width: 150 },
  ];

  const fetchData = async () => {
    try {
      setLoading(true); // Set loading state
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/users`,
      );

      if (response.data) {
                setData(response.data);
      }
    } catch (err) {
      setError("Failed to fetch data, try refreshing"); // Handle errors
      console.error(err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    alert(`Deleting user with ID:${id}`);
    // Add your delete logic here
  };

  const handleView = (user: User) => {
    alert(`Viewing user:${user.id}`);
    // Add your view logic here
  };

  const handleEdit = (user: User) => {
    alert(`Edit user:${user.id}`);
    // Add your edit logic here
  };
  return (
    <>
      <div className="flex max-w-full items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex-none">
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={() => alert("Add new user")}
          >
            Add New
          </button>
        </div>
        
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        // <div>
        //       <DatePickerOne />
        //       <DatePickerTwo />
        // </div>
        <div className="flex max-w-full items-center justify-center">
          <MyDataTable
            data={mockUsers}
            columns={userColumns}
            onDelete={handleDelete}
            onView={handleView}
            onEdit={handleEdit}
          />
        </div>
      )}
    </>
  );
}




