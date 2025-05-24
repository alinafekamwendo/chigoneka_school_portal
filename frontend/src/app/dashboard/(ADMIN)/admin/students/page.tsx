"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AdminDefaultLayout from "@/components/Layouts/AdminDefaultLayout";
import Table from "@/components/Tables/Table";

// Example with SWR
import useSWR from 'swr';
import TableOne from "@/components/Tables/TableOne";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

function Student() {
  const { data, error, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/users`,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return (
    
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Students</h1>
        {error && <div className="text-red-500">Failed to load data</div>}
        {!data && !error && <div>Loading...</div>}
        {data &&
         
          <Table
            title={"Student"}
            role="student"
            columns={["username", "phone", "email"]}
            data={data || []}
            onRefresh={() => mutate()}
          />
        }
        <TableOne/>
      </div>

  );
}

export default Student;