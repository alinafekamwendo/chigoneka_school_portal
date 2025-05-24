"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminDefaultLayout from "@/components/Layouts/AdminDefaultLayout";
import { FaArrowLeft } from "react-icons/fa";
import CustomDataTable from "@/components/Tables/CustomDataTable ";
import Spinner from "@/components/Spinner";
import axios from "axios";

const Profiles = () => {
  const router = useRouter();
  const params = useParams();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/users/${params.id}`,
        );
        setProfileData(response.data);
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProfileData();
    }
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      
        <Spinner />
     
    );
  }
  if (error) {
    return (
      
        <div className="text-red-500">{error}</div>
     
    );
  }

  return (
    
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 md:col-span-2">
              <h2 className="mb-4 text-xl font-bold">Related Data</h2>
              <CustomDataTable />
            </div>
   
  );
};

export default Profiles;
