// app/teacher/grading/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GradingPage() {
  const router = useRouter();
  const [isAuthorized] = useState(true); // Hardcoded for demo
  const [isLoading, setIsLoading] = useState(false); // No loading needed for sample data

  // Sample data - replace with your actual data structure
  const sampleAcademicYears = [
    { id: "1", name: "2023-2024" },
    { id: "2", name: "2024-2025" },
  ];

  const sampleTerms = [
    { id: "1", name: "First Term" },
    { id: "2", name: "Second Term" },
    { id: "3", name: "Third Term" },
  ];

  const sampleClasses = [
    { id: "1", name: "Class 1" },
    { id: "2", name: "Class 2" },
    { id: "3", name: "Class 3" },
  ];

  const sampleSubjects = [
    { id: "1", name: "Mathematics" },
    { id: "2", name: "Science" },
    { id: "3", name: "English" },
  ];

  const sampleStudents = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Mike Johnson" },
  ];

  // Form state
  const [formData, setFormData] = useState({
    academicYearId: "",
    termId: "",
    classId: "",
    subjectId: "",
  });

  // Data for dropdowns - initialized with sample data
  const [academicYears] = useState(sampleAcademicYears);
  const [terms] = useState(sampleTerms);
  const [classes] = useState(sampleClasses);
  const [subjects] = useState(sampleSubjects);
  const [students, setStudents] = useState([]);

  // Grades state
  const [grades, setGrades] = useState([]);

  // Simulate fetching students when class is selected
  useEffect(() => {
    if (formData.classId) {
      setStudents(sampleStudents);
      setGrades(
        sampleStudents.map((student) => ({
          studentId: student.id,
          mark: "",
          remarks: "",
        })),
      );
    }
  }, [formData.classId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (index, field, value) => {
    setGrades((prev) => {
      const newGrades = [...prev];
      newGrades[index] = { ...newGrades[index], [field]: value };
      return newGrades;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted grades:", grades);
    alert("Grades submitted successfully (check console for data)");
    //router.push("/teacher/dashboard");
    return
  };

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-500">Unauthorized access</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Student Grading</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Academic Year Dropdown */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Academic Year
            </label>
            <select
              name="academicYearId"
              value={formData.academicYearId}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>
          </div>

          {/* Term Dropdown */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Term
            </label>
            <select
              name="termId"
              value={formData.termId}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="">Select Term</option>
              {terms.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Dropdown */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Class
            </label>
            <select
              name="classId"
              value={formData.classId}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Dropdown */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Subject
            </label>
            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grading Table */}
        {students.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-b px-4 py-2">Student Name</th>
                  <th className="border-b px-4 py-2">Mark</th>
                  <th className="border-b px-4 py-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={student.id}
                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="border-b px-4 py-2">{student.name}</td>
                    <td className="border-b px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={grades[index]?.mark || ""}
                        onChange={(e) =>
                          handleGradeChange(index, "mark", e.target.value)
                        }
                        className="w-20 rounded border border-gray-300 p-1"
                        required
                      />
                    </td>
                    <td className="border-b px-4 py-2">
                      <input
                        type="text"
                        value={grades[index]?.remarks || ""}
                        onChange={(e) =>
                          handleGradeChange(index, "remarks", e.target.value)
                        }
                        className="w-full rounded border border-gray-300 p-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={!formData.subjectId || students.length === 0}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            Submit Grades
          </button>
        </div>
      </form>
    </div>
  );
}
