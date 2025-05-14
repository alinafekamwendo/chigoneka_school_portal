"use client";
import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const studentData = {
  name: "John Doe",
  grade: "7",
  schoolYear: "2021-2022",
  gradingPeriod: "1st Quarter",
  subjects: [
    { name: "Math", score: 94, grade: "A" },
    { name: "Science", score: 84, grade: "B" },
    { name: "English", score: 89, grade: "A" },
    { name: "History", score: 78, grade: "B" },
  ],
};

const SchoolReportForm = () => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Set up PDF styles
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);

    // Add title
    doc.text("Middle School Report", 105, 20, { align: "center" });

    // Add student information
    doc.setFontSize(12);
    doc.text(`Name: ${studentData.name}`, 10, 40);
    doc.text(`Grade: ${studentData.grade}`, 10, 50);
    doc.text(`School Year: ${studentData.schoolYear}`, 10, 60);
    doc.text(`Grading Period: ${studentData.gradingPeriod}`, 10, 70);

    // Add subjects table
    const tableColumn = ["Subject", "Score", "Grade"];
    const tableRows = studentData.subjects.map((subject) => [
      subject.name,
      subject.score,
      subject.grade,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 80,
      theme: "grid",
      styles: { fontSize: 12, cellPadding: 5 },
      headStyles: { fillColor: [200, 200, 200] }, // Gray background for header
    });

    // Add attendance details
    const attendanceY = doc.lastAutoTable.finalY + 20; // Position after the table
    doc.setFontSize(12);
    doc.text(
      `Total No. of School Days: ${studentData.subjects.length}`,
      10,
      attendanceY,
    );
    doc.text(`Days Present: ${studentData.name}`, 10, attendanceY + 10);
    doc.text(`Days Absent: ${studentData.name}`, 10, attendanceY + 20);
    doc.text(`Days Tardy: ${studentData.name}`, 10, attendanceY + 30);

    // Save the PDF
    doc.save(`${studentData.name}_school_report.pdf`);
  };

  return (
    <div className="rounded-lg p-6 shadow-md">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-center border-b-2 pb-4">
        <h1 className="text-center text-2xl font-bold text-green-500">
          Mount Carmel Of God Academy
        </h1>
      </div>

      {/* Student Info Section */}
      <div className="mb-6 flex flex-row justify-between">
        <h2 className="mb-2 text-xl font-semibold">Student Information</h2>
        <p>
          <strong>Name:</strong> {studentData.name}
        </p>
        <p>
          <strong>Grade:</strong> {studentData.grade}
        </p>
        <p>
          <strong>School Year:</strong> {studentData.schoolYear}
        </p>
        <p>
          <strong>Grading Period:</strong> {studentData.gradingPeriod}
        </p>
      </div>

      {/* Subjects Table */}
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Subjects and Grades</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 ">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Subject
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left ">
                Score
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left ">
                Grade
              </th>
            </tr>
          </thead>
          <tbody>
            {studentData.subjects.map((subject, index) => (
              <tr key={index} className="even:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {subject.name}
                </td>
                <td className="border border-gray-300 px-4 py-2 ">
                  {subject.score}
                </td>
                <td className="border border-gray-300 px-4 py-2 ">
                  {subject.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attendance Section */}
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Attendance</h2>
        <p>
          <strong>Total No. of School Days:</strong>{" "}
          {studentData.subjects.length}
        </p>
        <p>
          <strong>Days Present:</strong> {studentData.name}
        </p>
        <p>
          <strong>Days Absent:</strong> {studentData.name}
        </p>
        <p>
          <strong>Days Tardy:</strong> {studentData.name}
        </p>
      </div>

      {/* Download Button */}
      <button
        onClick={generatePDF}
        className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
      >
        Download Report
      </button>
    </div>
  );
};

export default SchoolReportForm;
