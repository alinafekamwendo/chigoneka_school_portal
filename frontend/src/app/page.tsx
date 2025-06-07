import School from "@/components/Dashboard/School";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMIS",
  description: "School management system for managing students, teachers, and classes",
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
