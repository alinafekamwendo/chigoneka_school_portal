// components/TeacherAssignmentForm.js
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function TeacherAssignmentForm({
  teachers,
  subjects,
  classes,
  terms,
  years,
}) {
  const { register, handleSubmit } = useForm();
  const [assignments, setAssignments] = useState([]);

  const onSubmit = (data) => {
    // Create new assignment object
    const newAssignment = {
      teacherId: data.teacherId,
      subjectId: data.subjectId,
      classId: data.classId,
      termId: data.termId,
      yearId: data.yearId,
      isHOD: data.isHOD,
    };

    setAssignments([...assignments, newAssignment]);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">Assign Teacher Duties</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Form fields for assignment */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Teacher, Subject, Class, Term, Year selectors */}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isHOD"
            {...register("isHOD")}
            className="mr-2"
          />
          <label htmlFor="isHOD">Head of Department</label>
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Add Assignment
        </button>
      </form>

      {/* Assignments preview table */}
      <div className="mt-8">
        <h3 className="mb-2 font-semibold">Current Assignments</h3>
        <table className="min-w-full">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Subject</th>
              <th>Class</th>
              <th>Term/Year</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment, index) => (
              <tr key={index}>
                <td>
                  {teachers.find((t) => t.id === assignment.teacherId)?.name}
                </td>
                <td>
                  {subjects.find((s) => s.id === assignment.subjectId)?.name}
                </td>
                <td>
                  {classes.find((c) => c.id === assignment.classId)?.name}
                </td>
                <td>
                  {terms.find((t) => t.id === assignment.termId)?.name} /
                  {years.find((y) => y.id === assignment.yearId)?.name}
                </td>
                <td>{assignment.isHOD ? "HOD" : "Teacher"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
