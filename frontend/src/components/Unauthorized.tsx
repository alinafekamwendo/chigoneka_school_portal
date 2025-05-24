// app/components/UnauthorizedContent.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/service/authContext"; // Adjust the path as needed

const UnauthorizedContent = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const loggedIn = await isAuthenticated();
      if (loggedIn && user?.role) {
        router.push(`/dashboard/${user.role}`);
      }
    };

    checkAuthAndRedirect();
  }, [user, isAuthenticated, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
      <h1 className="mb-4 text-4xl font-bold text-red-600 dark:text-red-500">
        Unauthorized
      </h1>
      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        {user?.role
          ? `You do not have permission to access this page. Redirecting to your dashboard...`
          : `You do not have permission to access this page.`}
      </p>
      {user?.role ? (
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          If you are not redirected automatically,{" "}
          <Link
            href={`/dashboard/${user.role}`}
            className="text-blue-500 hover:underline"
          >
            click here
          </Link>
          .
        </p>
      ) : (
        <Link
          href="/auth/login"
          className="rounded-md bg-blue-500 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Log In
        </Link>
      )}
      <Link
        href="/"
        className="mt-2 rounded-md bg-gray-300 px-4 py-2 font-semibold text-gray-700 shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        Go Back to Homepage
      </Link>
    </div>
  );
};

export default UnauthorizedContent;
