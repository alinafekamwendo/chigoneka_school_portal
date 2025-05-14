"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminDefaultLayout from "@/components/Layouts/AdminDefaultLayout";
import Table from "@/components/Tables/Table";

export default function Parent() {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Handle errors

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

  return (
    <AdminDefaultLayout>
      <button className="text-blue-500" type="button" onClick={fetchData}>
        Refresh
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Table
          title={"Parent"}
              columns={["username", "phone", "email"]}
              role="parent"
          data={data}
        />
      )}
    </AdminDefaultLayout>
  );
}
