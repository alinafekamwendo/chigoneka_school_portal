"use client"; // Mark as a client-side component

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";


const LoadingPage = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking if the user is logged in
    const checkLoginStatus = async () => {
      // Example: Check if the user is logged in by checking localStorage
      const user = localStorage.getItem("user");

      // Simulate a delay (e.g., API call or async operation)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // if (user) {
      //   // If logged in, redirect to the dashboard
      //   const role = localStorage.getItem("role");
      //   //router.push(`/dashboard/${role}`);
      //   router.push("/");
      // } else {
      //   // If not logged in, redirect to the login page
      //   router.push("/auth/signin");
      //   //router.push("/");
      // }

      setIsLoading(false);
    };

    checkLoginStatus();
  }, [router]);

  return (
    <div>
      {isLoading ? (
        <Spinner /> // Show spinner while checking login status
      ) : (
        children // Render children once loading is done
      )}
    </div>
  );
};

export default LoadingPage;
