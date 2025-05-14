"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminDefaultLayout from "@/components/Layouts/AdminDefaultLayout";
import AdminUserDataTable from "@/components/Tables/AdminUserDataTable";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import DatePickerTwo from "@/components/FormElements/DatePicker/DatePickerTwo";

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
        console.log(response.data); // Log the response data
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

  return (
    <AdminDefaultLayout>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        // <div>
        //       <DatePickerOne />
        //       <DatePickerTwo />
        // </div>
        <div className="flex max-w-full">
          <AdminUserDataTable
            data={data}
            columns={columns}
            fetchData={fetchData}
            title="Admins"
          />
        </div>
      )}
    </AdminDefaultLayout>
  );
}
