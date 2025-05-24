// pages/dashboard/teachers.tsx
"use client";

import React, { useEffect, useState } from "react";
import AdminUserDataTable from "../../../../../components/Tables/AdminUserDataTable";
import { NextPage } from "next";
import AdminDefaultLayout from "../../../../../components/Layouts/AdminDefaultLayout";
import { Metadata } from "next";
import { Button, CircularProgress } from "@mui/material";
import AddTeacherModal from "../../../../../components/Teachers/AddTeacherModal";
import {
  fetchTeachers,
  addTeacher,
} from "../../../../../service/teacher_service";
import {
  getValueFromValueOptions,
  getValueOptions,
} from "@mui/x-data-grid/components/panel/filterPanel/filterPanelUtils";

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const TeachersPage: NextPage = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const data = await fetchTeachers();
        setTeachers(data);
      } catch (err) {
        setError("Failed to load teachers");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

  const handleAddTeacher = async (teacherData: {
    name: string;
    email: string;
    subject: string;
  }) => {
    try {
      const newTeacher = await addTeacher(teacherData);
      setTeachers((prev) => [...prev, newTeacher]);
    } catch (err) {
      setError("Failed to add teacher");
      console.error(err);
    }
  };

  const tableData = teachers.map((teacher) => [teacher]);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "firstName", headerName: "FirstName", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
    },
  ];

  const customOptions = {
    customToolbar: () => (
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddModal(true)}
      >
        Add Teacher
      </Button>
    ),
  };

  if (loading)
    return (
      <AdminDefaultLayout>
        <CircularProgress />
      </AdminDefaultLayout>
    );

  return (
    
      <div>
        <AdminUserDataTable
          title="Teachers"
          data={teachers}
          columns={columns}
          options={customOptions}
        />
        <div>
          <AddTeacherModal
            open={openAddModal}
            onClose={() => setOpenAddModal(false)}
            onSave={handleAddTeacher}
          />
        </div>
      </div>
   
  );
};

export default TeachersPage;
