import AdminDashboard from "../../../components/Dashboard/AdminDashboard"
import { Metadata } from "next";
import AdminDefaultLayout from "../../../components/Layouts/AdminDefaultLayout"
import React from "react";


export const metadata: Metadata = {
  title:
    "MCGA SMIS-ADMIN DASHBOARD",
  description: "School management system for Mt Carmel of God Academy",
};

const AdminDashboardPage=()=> {
  return (
    
      <AdminDefaultLayout>
        <AdminDashboard />
      </AdminDefaultLayout>
   
  );
}
 export default AdminDashboardPage;