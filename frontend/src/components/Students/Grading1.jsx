// pages/dashboard/grading.js
"use client";

import { useState, useEffect, useCallback } from "react";
import Head from "next/head";

// Import mock API functions
import {
  fetchAcademicYears as mockFetchAcademicYears,
  fetchTerms as mockFetchTerms,
  fetchClasses as mockFetchClasses,
  fetchSubjects as mockFetchSubjects,
  fetchGradingData as mockFetchGradingData,
  saveGrades as mockSaveGrades,
} from "../../service/mockAPI";

const useAuth = () => ({
  user: { id: 99, role: "teacher", firstName: "Mock", lastName: "Teacher" },
});

const GradingPage = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { user } = useAuth();

  // Fetch Academic Years - runs once on mount
  useEffect(() => {
    const getYears = async () => {
      setIsLoadingOptions(true);
      setError(null);
      try {
        const data = await mockFetchAcademicYears();
        setAcademicYears(data);
      } catch (err) {
        setError("Failed to load academic years.");
        console.error(err);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    getYears();
  }, []);

  // Fetch Terms - runs when selectedYear changes
  useEffect(() => {
    const getTerms = async () => {
      if (!selectedYear) {
        setTerms([]);
        return;
      }

      setIsLoadingOptions(true);
      setError(null);
      try {
        const data = await mockFetchTerms(selectedYear);
        setTerms(data);
      } catch (err) {
        setError("Failed to load terms.");
        console.error(err);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    getTerms();
  }, [selectedYear]);

  // Fetch Classes - runs when selectedYear or selectedTerm changes
  useEffect(() => {
    const getClasses = async () => {
      if (!selectedYear || !selectedTerm) {
        setClasses([]);
        return;
      }

      setIsLoadingOptions(true);
      setError(null);
      try {
        const data = await mockFetchClasses(
          selectedYear,
          selectedTerm,
          user.id,
        );
        setClasses(data);
      } catch (err) {
        setError("Failed to load classes.");
        console.error(err);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    getClasses();
  }, [selectedYear, selectedTerm, user.id]);

  // Fetch Subjects - runs when selectedYear, selectedTerm or selectedClass changes
  useEffect(() => {
    const getSubjects = async () => {
      if (!selectedYear || !selectedTerm || !selectedClass) {
        setSubjects([]);
        return;
      }

      setIsLoadingOptions(true);
      setError(null);
      try {
        const data = await mockFetchSubjects(
          selectedYear,
          selectedTerm,
          selectedClass,
          user.id,
        );
        setSubjects(data);
      } catch (err) {
        setError("Failed to load subjects.");
        console.error(err);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    getSubjects();
  }, [selectedYear, selectedTerm, selectedClass, user.id]);

  // Fetch Student Data - runs when all selections are made
  const fetchStudentData = useCallback(async () => {
    if (!selectedYear || !selectedTerm || !selectedClass || !selectedSubject) {
      setStudents([]);
      setGrades({});
      return;
    }

    setIsLoadingData(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const data = await mockFetchGradingData(
        selectedYear,
        selectedTerm,
        selectedClass,
        selectedSubject,
      );
      setStudents(data);

      const initialGrades = {};
      data.forEach((student) => {
        initialGrades[student.id] = student.grade
          ? String(student.grade.mark)
          : "";
      });
      setGrades(initialGrades);
    } catch (err) {
      setError(
        `Failed to load grading data: ${err.message || "An error occurred."}`,
      );
      console.error(err);
    } finally {
      setIsLoadingData(false);
    }
  }, [selectedYear, selectedTerm, selectedClass, selectedSubject]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const handleGradeChange = (studentId, mark) => {
    const validatedMark =
      mark === "" || /^[0-9]*(\.[0-9]*)?$/.test(mark)
        ? mark
        : grades[studentId];

    setGrades((prevGrades) => ({
      ...prevGrades,
      [studentId]: validatedMark,
    }));
  };

  const handleSaveGrades = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    const gradesToSave = Object.keys(grades)
      .map((studentId) => {
        const markValue = grades[studentId];
        const formattedMark = markValue === "" ? null : parseFloat(markValue);

        if (markValue !== "" && isNaN(formattedMark)) {
          console.warn(
            `Invalid mark for student ${studentId}: "${markValue}". Skipping.`,
          );
          return null;
        }

        return {
          studentId: parseInt(studentId, 10),
          mark: formattedMark,
        };
      })
      .filter((grade) => grade !== null && grade.mark !== null);

    if (gradesToSave.length === 0) {
      setError("No valid grades to save.");
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        academicYearId: parseInt(selectedYear, 10),
        termId: parseInt(selectedTerm, 10),
        classId: parseInt(selectedClass, 10),
        subjectId: parseInt(selectedSubject, 10),
        grades: gradesToSave,
      };

      const result = await mockSaveGrades(payload);
      setSuccessMessage(result.message || "Grades saved successfully (mock)!");
      fetchStudentData(); // Refresh data after save
    } catch (err) {
      setError(
        `Failed to save grades (mock): ${err.message || "An error occurred."}`,
      );
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const isSaveEnabled =
    selectedYear &&
    selectedTerm &&
    selectedClass &&
    selectedSubject &&
    students.length > 0 &&
    !isSaving;

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Grading | Your App</title>
      </Head>
      <h1 className="mb-4 text-2xl font-bold">Grade Entry (Mock Data)</h1>

      {/* Filter Section */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Academic Year Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Academic Year
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setSelectedTerm("");
              setSelectedClass("");
              setSelectedSubject("");
            }}
            disabled={isLoadingOptions}
          >
            <option value="">Select Year</option>
            {academicYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.year}
              </option>
            ))}
          </select>
        </div>

        {/* Term Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Term
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={selectedTerm}
            onChange={(e) => {
              setSelectedTerm(e.target.value);
              setSelectedClass("");
              setSelectedSubject("");
            }}
            disabled={isLoadingOptions || !selectedYear}
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
          <label className="block text-sm font-medium text-gray-700">
            Class
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSubject("");
            }}
            disabled={isLoadingOptions || !selectedTerm}
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
          <label className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={isLoadingOptions || !selectedClass}
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

      {/* Loading and Error States */}
      {isLoadingOptions && <p>Loading options...</p>}
      {isLoadingData && <p>Loading student data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* Grading Table */}
      {!isLoadingData && students.length > 0 && (
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Admission No.
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Student Name
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {student.admissionNumber}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <input
                      type="text"
                      className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={grades[student.id] || ""}
                      onChange={(e) =>
                        handleGradeChange(student.id, e.target.value)
                      }
                      disabled={isSaving}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Save Button */}
      {!isLoadingData && students.length > 0 && (
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleSaveGrades}
            disabled={!isSaveEnabled}
          >
            {isSaving ? "Saving..." : "Save Grades (Mock)"}
          </button>
        </div>
      )}

      {/* Message if no data found */}
      {!isLoadingData &&
        !isLoadingOptions &&
        selectedYear &&
        selectedTerm &&
        selectedClass &&
        selectedSubject &&
        students.length === 0 && (
          <p>
            No students found for the selected criteria or mock teacher is not
            assigned to grade this subject/class.
          </p>
        )}
    </div>
  );
};

export default GradingPage;
