import School from "@/components/Dashboard/School";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

export const metadata: Metadata = {
  title: "Mount Carmel Of God || SMIS",
  description: "School management system for Mt Carmel of God Academy",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <School />
      </DefaultLayout>
    </>
  );
}
