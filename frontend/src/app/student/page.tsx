import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import TableOne from "@/components/Tables/TableOne";
import Table from "@/components/Tables/Table";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCGA SMIS-ADMIN DASHBOARD",
  description: "School management system for Mt Carmel of God Academy",
};

const columns = [
  "Info",
  "StudentID",
  "Subjects",
  "Classes",
  "Phone",
  "Address",
];
const data = [
  {
    name: "Jane Doe",
    email: "johndoe@gmail.com",
    teacher_id: "1234567890",
    subjects: "Math, Geometry",
    classes: "18, 2A, 3C",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    name: "Jane Doe",
    email: "johndoe@gmail.com",
    teacher_id: "1234567890",
    subjects: "Math, Geometry",
    classes: "18, 2A, 3C",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    name: "Jane Doe",
    email: "johndoe@gmail.com",
    teacher_id: "1234567890",
    subjects: "Math, Geometry",
    classes: "18, 2A, 3C",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    name: "Jane Doe",
    email: "johndoe@gmail.com",
    teacher_id: "1234567890",
    subjects: "Math, Geometry",
    classes: "18, 2A, 3C",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    name: "Jane Doe",
    email: "johndoe@gmail.com",
    teacher_id: "1234567890",
    subjects: "Math, Geometry",
    classes: "18, 2A, 3C",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    name: "Jane Doe",
    email: "johndoe@gmail.com",
    teacher_id: "1234567890",
    subjects: "Math, Geometry",
    classes: "18, 2A, 3C",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    name: "Jane Doe",
    email: "johndoe@gmail.com",
    teacher_id: "1234567890",
    subjects: "Math, Geometry",
    classes: "18, 2A, 3C",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    name: "Jane Doe",
    email: "johndoe@gmail.com",
    teacher_id: "1234567890",
    subjects: "Math, Geometry",
    classes: "18, 2A, 3C",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    name: "Jane Doe",
    email: "johndoe@gmail.com",
    teacher_id: "1234567890",
    subjects: "Physics, Chemistry",
    classes: "5A, 4B, 3C",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    name: "Kamwendo Alinafe",
    email: "johndoe@gmail.com",
    teacher_id: "1234567890",
    subjects: "Physics, Chemistry",
    classes: "5A, 4B, 3C",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  // Add more rows as needed
];
export default function student() {

  return (
     
    <DefaultLayout>
      <Table title={ "Students:"} columns={columns} role="student" data={data} />
    </DefaultLayout>
  
  );
}
