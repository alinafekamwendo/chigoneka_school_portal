"use client"; // Add this directive for client-side interactivity

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import ProfileBox from "@/components/ProfileBox";
import AdminDefaultLayout from "@/components/Layouts/AdminDefaultLayout";
import { FaArrowLeft } from "react-icons/fa"; // Import the back arrow icon
import CustomDataTable from "@/components/Tables/CustomDataTable ";
import Spinner from "@/components/Spinner"; // Import your Spinner component
import ResponsiveDataTable from "@/components/Tables/ResponsiveDataGrid";
import TableOne from "@/components/Tables/TableOne";

const Profiles = () => {
  const router = useRouter(); // Initialize useRouter
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Simulate loading (replace with your actual data loading logic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  // Function to handle back navigation
  const handleBack = () => {
    router.back(); // Navigate to the previous URL
  };

  const handleView = (row: any) => {
    alert(`Viewing row with ID: ${row.id}`);
  };

  const handleEdit = (row: any) => {
    alert(`Editing row with ID: ${row.id}`);
  };

  const handleDelete = (row: any) => {
    alert(`Deleting row with ID: ${row.id}`);
  };

  // // Return spinner while loading
  // if (isLoading) {
  //   return <Spinner />;
  // }
  //sample data
      const columns = [
         { field: "id", headerName: "ID", width: 70 },
         { field: "firstName", headerName: "First Name", width: 150 },
         { field: "lastName", headerName: "Last Name", width: 150 },
         { field: "age", headerName: "Age", width: 100, type: "number" },
         { field: "email", headerName: "Email", width: 200 },
       ];
  
       const rows = [
         {
           id: 1,
           firstName: "Alice",
           lastName: "Smith",
           age: 25,
           email: "alice@example.com",
         },
         {
           id: 2,
           firstName: "Bob",
           lastName: "Brown",
           age: 30,
           email: "bob@example.com",
         },
         {
           id: 3,
           firstName: "Charlie",
           lastName: "Davis",
           age: 35,
           email: "charlie@example.com",
         },
         // Add more rows as needed
       ];

  return (
    <AdminDefaultLayout>
      {/* Back Arrow */}
      <div className="mb-1 flex items-center">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-gray-300"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="py-20">
         
            <CustomDataTable />
          
      
        </div>
      )}
    </AdminDefaultLayout>
  );
};

export default Profiles;
