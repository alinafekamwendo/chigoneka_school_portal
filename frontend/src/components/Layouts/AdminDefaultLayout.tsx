"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import LoadingPage from "@/app/loading";
import RoleProtectedRoute from "../RoleProtectedRoute";
import { useAuth } from "@/service/authContext";
import Spinner from "../Spinner";


import {
  BsGrid,
  BsGear,
  BsHouses,
  BsArrowUpRightCircle,
  BsFolder2Open,
  BsPeople,
} from "react-icons/bs";

const menuGroups = [
  {
    name: "MENU",

    menuItems: [
      {
        icon: <BsGrid className="fill-current" size={20} />,
        label: "Dashboard",
        route: "/dashboard/admin",
      },
      {
        icon: <BsPeople className="fill-current" size={20} />,
        label: "Admins",
        route: "#",
        children: [
          { label: "Add Admin", route: "/dashboard/admin/admins/add" },
          { label: "Manage", route: "/dashboard/admin/admins/manage" },
        ],
      },
      {
        icon: <BsPeople className="fill-current" size={20} />,
        label: "Teachers",
        route: "#",
        children: [
          { label: "Add Teacher", route: "/dashboard/admin/add-admin" },
          { label: "Manage", route: "/dashboard/admin/manage-admins" },
          { label: "Teacher reports", route: "/dashboard/admin/parents" },
          { label: "Assign Duties", route: "/dashboard/admin/teachers" },
        ],
      },
      {
        icon: <BsPeople className="fill-current" size={20} />,
        label: "Parents",
        route: "#",
        children: [
          { label: "Add Parent", route: "/dashboard/admin/admins" },
          { label: "Manage", route: "/dashboard/admin/teachers" },
        ],
      },
      {
        icon: <BsPeople className="fill-current" size={20} />,
        label: "Students",
        route: "#",
        children: [
          { label: "Add Student", route: "/dashboard/admin/admins" },
          { label: "Manage", route: "/dashboard/admin/teachers" },
          { label: "Reports", route: "/dashboard/admin/parents" },
          { label: "Promote Student", route: "/dashboard/admin/students" },
        ],
      },
      {
        icon: <BsFolder2Open className="fill-current" size={20} />,
        label: "School",
        route: "#",
        children: [
          { label: "General Report", route: "/dashboard/admin/admins" },
          { label: "Finances", route: "/dashboard/admin/parents" },
          { label: "Time Table", route: "/dashboard/admin/students" },
          { label: "Examinations", route: "/dashboard/admin/students" },
          { label: "Community", route: "/dashboard/admin/students" },
        ],
      },
      {
        icon: <BsHouses className="fill-current" size={20} />,
        label: "Classes",
        route: "#",
        children: [
          { label: "Add Class", route: "/pages/settings" },
          { label: "Manage", route: "/dashboard/admin/examinations" },
          { label: "Class Reports", route: "/pages/settings" },
        ],
      },
    ],
  },
  {
    menuItems: [
      {
        icon: <BsGear className="fill-current" size={20} />,
        label: "User",
        route: "#",
        children: [
          { label: "Profile", route: "/auth/signin" },
          {
            label: "Logout",
            route: "/auth/logout",
            icon: <BsArrowUpRightCircle className="ml-2" />,
          },
        ],
      },
    ],
  },
];

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuGroups={menuGroups}
      />

      {/* Content Area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main>
          <div className="mx-auto max-w-full p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
