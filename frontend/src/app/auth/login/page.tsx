import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
//import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Signin from "@/components/Auth/Signin";

export const metadata: Metadata = {
  title: "School MIS-Login",
  description: "Login page for Mount carmel of God Academy",
};

const SignIn: React.FC = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="rounded-[10px] bg-white/90 shadow-1 backdrop-blur-sm dark:bg-gray-dark/90 dark:shadow-card">
   
              <div className="w-full p-4 sm:p-12.5 xl:p-15">
                <Signin />
              </div>
           
       
        </div>
      </div>
    </div>
  );
};

export default SignIn;
