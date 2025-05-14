import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
//import DefaultLayout from "@/components/Layouts/DefaultLaout";
import SignupForm from "@/components/Auth/signup/SignupForm";

export const metadata: Metadata = {
  title: "School MIS-Signup",
  description: "Login page for Mount carmel of God Academy",
};

const SignupPage: React.FC = () => {
  return (
    //<DefaultLayout>
    <>
      {/* <Breadcrumb pageName="Sign In" /> */}

      <div className="rounded-[10px] bg-gray-100 dark:bg-gray-dark dark:shadow-card">

        <div className="flex flex-wrap items-center">
      
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
              <SignupForm />
            </div>
        

        </div>
      </div>
    </>
    // </DefaultLayout>
  );
};

export default SignupPage;
