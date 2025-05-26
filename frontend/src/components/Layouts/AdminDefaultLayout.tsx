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
          { label: "Add Teacher", route: "/dashboard/admin/teachers/add" },
          { label: "Manage", route: "/dashboard/admin/teachers/manage" },
          { label: "Teacher reports", route: "/dashboard/admin/teachers/reports" },
          { label: "Assign Duties", route: "/dashboard/admin/teachers/duties" },
        ],
      },
      {
        icon: <BsPeople className="fill-current" size={20} />,
        label: "Parents",
        route: "#",
        children: [
          { label: "Add Parent", route: "/dashboard/admin/parents/add" },
          { label: "Manage", route: "/dashboard/admin/parents" },
        ],
      },
      {
        icon: <BsPeople className="fill-current" size={20} />,
        label: "Students",
        route: "#",
        children: [
          { label: "Add Student", route: "/dashboard/admin/students/add" },
          { label: "Manage", route: "/dashboard/admin/students" },
          { label: "Reports", route: "/dashboard/admin/students/reports" },
          { label: "Promote Student", route: "/dashboard/admin/students/promote" },
        ],
      },
      {
        icon: <BsFolder2Open className="fill-current" size={20} />,
        label: "School",
        route: "#",
        children: [
          { label: "General Report", route: "/dashboard/admin/school" },
          { label: "Finances", route: "/dashboard/admin/school/finances" },
          { label: "Time Table", route: "/dashboard/admin/school/timetable" },
          { label: "Examinations", route: "/dashboard/admin/school/examinations" },
          { label: "Community", route: "/dashboard/admin/school/community" },
        ],
      },
      {
        icon: <BsHouses className="fill-current" size={20} />,
        label: "Classes",
        route: "#",
        children: [
          { label: "Add Class", route: "/dashboard/admin/classes/add" },
          { label: "Manage", route: "/dashboard/admin/classes/manage" },
          { label: "Class Reports", route: "/dashboard/admin/classes/reports" },
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
          { label: "Profile", route: "/auth/login" },
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
