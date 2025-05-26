"use client";
import Link from "next/link";
import React from "react";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";


export default function Signin() {
  return (
  
    <>
      <div className="bg-gradient mb-2 rounded-[10px] p-4 dark:bg-gray-dark dark:shadow-card">
        <div className="flex items-center justify-center  text-white font-extrabold">
          <h1 >CHIGONEKA CDSS</h1>
        </div>
        <div className="mt-4 flex items-center justify-center ">
          <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
          <div className="block w-full min-w-fit px-2 text-center font-normal text-white dark:bg-gray-dark">
            <h2>Login Form</h2>
          </div>
          <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        </div>
      </div>

      <SigninWithPassword />

      <div className="mt-6 text-center">
        <p>
          Don’t have account?{" "}
          <Link href="/auth/signup" className="text-primary">
            Register here
          </Link>
        </p>
      </div>
    </>
 
  );
}
