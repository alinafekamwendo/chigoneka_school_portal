import React from 'react';
import Admins from '@/components/Admin/Admins';
import { Metadata } from "next";
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

export const metadata: Metadata = {
  title: "Chigoneka smis",
  keywords: ["admin", "manage admins", "school management system", "admins"],
  description: "Manage admins in the school management system",
  openGraph: {  
    title: "ADMIN | Manage Admins",
    description: "Manage admins in the school management system",
    url: "/dashboard/admin/admins/manage",
    images: [
      {
        url: "/images/school-management-system.png",
        width: 800,
        height: 600,
        alt: "School Management System",
      },
    ],
  },
};
function page() {
  return (
    <div>
      <Breadcrumb pageName="Manage Admins" />
      <Admins />
    </div>
  );
}

export default page;
