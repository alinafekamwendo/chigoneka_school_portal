// services/mockApi.js

// Sample Data Structures (match your expected backend API responses)

const mockAcademicYears = [
  { id: 1, year: "2023/2024" },
  { id: 2, year: "2024/2025" },
  { id: 3, year: "2025/2026" },
];

const mockTerms = [
  { id: 11, academicYearId: 1, name: "Term 1" },
  { id: 12, academicYearId: 1, name: "Term 2" },
  { id: 13, academicYearId: 1, name: "Term 3" },
  { id: 21, academicYearId: 2, name: "Term 1" },
  { id: 22, academicYearId: 2, name: "Term 2" },
  { id: 23, academicYearId: 2, name: "Term 3" },
  { id: 31, academicYearId: 3, name: "Term 1" },
  { id: 32, academicYearId: 3, name: "Term 2" },
  { id: 33, academicYearId: 3, name: "Term 3" },
];

const mockClasses = [
  { id: 101, academicYearId: 1, name: "Grade 7A" },
  { id: 102, academicYearId: 1, name: "Grade 7B" },
  { id: 103, academicYearId: 1, name: "SS3 Science" },
  { id: 201, academicYearId: 2, name: "Grade 8A" },
  { id: 202, academicYearId: 2, name: "Grade 8B" },
  { id: 203, academicYearId: 2, name: "SS1 Arts" },
];

const mockSubjects = [
  { id: 1001, name: "Mathematics" },
  { id: 1002, name: "Physics" },
  { id: 1003, name: "Chemistry" },
  { id: 1004, name: "Biology" },
  { id: 1005, name: "Literature" },
  { id: 1006, name: "History" },
];

// Sample Teacher Assignments (to simulate teacher-specific filtering)
// Let's assume the logged-in teacher (mock user.id = 99) teaches:
// - Math in 2024/2025, Term 2, Grade 8A
// - Physics in 2024/2025, Term 2, SS3 Science (assuming SS3 is available in year 2)
const mockTeacherAssignments = [
  {
    teacherId: 99,
    academicYearId: 2,
    termId: 22,
    classId: 201,
    subjectId: 1001,
  }, // Math, 2024/2025, Term 2, Grade 8A
  {
    teacherId: 99,
    academicYearId: 2,
    termId: 22,
    classId: 103,
    subjectId: 1002,
  }, // Physics, 2024/2025, Term 2, SS3 Science (Adjust classId as needed)
];

// Sample Student Data for Grade 8A (classId: 201, academicYearId: 2)
const mockStudents_Grade8A = [
  {
    id: 2001,
    firstName: "Alice",
    lastName: "Smith",
    admissionNumber: "ADM001",
    currentClassId: 201,
    academicYearId: 2,
  },
  {
    id: 2002,
    firstName: "Bob",
    lastName: "Johnson",
    admissionNumber: "ADM002",
    currentClassId: 201,
    academicYearId: 2,
  },
  {
    id: 2003,
    firstName: "Charlie",
    lastName: "Williams",
    admissionNumber: "ADM003",
    currentClassId: 201,
    academicYearId: 2,
  },
  {
    id: 2004,
    firstName: "Diana",
    lastName: "Brown",
    admissionNumber: "ADM004",
    currentClassId: 201,
    academicYearId: 2,
  },
];

// Sample Student Data for SS3 Science (classId: 103, academicYearId: 2 - adjust academicYearId if SS3 is tied to a specific year)
// Assuming SS3 Science is classId 103, and is available in academicYearId 2
const mockStudents_SS3Science = [
  {
    id: 3001,
    firstName: "Eve",
    lastName: "Jones",
    admissionNumber: "ADM011",
    currentClassId: 103,
    academicYearId: 2,
  },
  {
    id: 3002,
    firstName: "Frank",
    lastName: "Garcia",
    admissionNumber: "ADM012",
    currentClassId: 103,
    academicYearId: 2,
  },
  {
    id: 3003,
    firstName: "Grace",
    lastName: "Miller",
    admissionNumber: "ADM013",
    currentClassId: 103,
    academicYearId: 2,
  },
];

// Sample Grades (matching studentId, subjectId, termId, academicYearId)
const mockGrades = [
  {
    id: 5001,
    studentId: 2001,
    subjectId: 1001,
    termId: 22,
    academicYearId: 2,
    classId: 201,
    mark: 88.5,
    gradedByTeacherId: 99,
  }, // Alice, Math, Term 2, Year 2, Grade 8A
  {
    id: 5002,
    studentId: 2003,
    subjectId: 1001,
    termId: 22,
    academicYearId: 2,
    classId: 201,
    mark: 76.0,
    gradedByTeacherId: 99,
  }, // Charlie, Math, Term 2, Year 2, Grade 8A
  // Add grades for Physics if needed, e.g., for students in SS3Science
  {
    id: 5003,
    studentId: 3001,
    subjectId: 1002,
    termId: 22,
    academicYearId: 2,
    classId: 103,
    mark: 92.0,
    gradedByTeacherId: 99,
  }, // Eve, Physics, Term 2, Year 2, SS3 Science
];

// Helper function to simulate network delay
const simulateDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API Functions

export const fetchAcademicYears = async () => {
  await simulateDelay(500); // Simulate network latency
  return mockAcademicYears;
};

export const fetchTerms = async (academicYearId) => {
  await simulateDelay(500);
  const filteredTerms = mockTerms.filter(
    (term) => term.academicYearId === parseInt(academicYearId),
  );
  return filteredTerms;
};

export const fetchClasses = async (academicYearId, termId, teacherId) => {
  await simulateDelay(500);
  // Simulate teacher assignment filtering
  const assignedClassesIds = mockTeacherAssignments
    .filter(
      (assignment) =>
        assignment.teacherId === teacherId &&
        assignment.academicYearId === parseInt(academicYearId) &&
        assignment.termId === parseInt(termId),
    )
    .map((assignment) => assignment.classId);

  const filteredClasses = mockClasses.filter((cls) =>
    assignedClassesIds.includes(cls.id),
  );

  return filteredClasses;
};

export const fetchSubjects = async (
  academicYearId,
  termId,
  classId,
  teacherId,
) => {
  await simulateDelay(500);
  // Simulate teacher assignment filtering
  const assignedSubjectIds = mockTeacherAssignments
    .filter(
      (assignment) =>
        assignment.teacherId === teacherId &&
        assignment.academicYearId === parseInt(academicYearId) &&
        assignment.termId === parseInt(termId) &&
        assignment.classId === parseInt(classId),
    )
    .map((assignment) => assignment.subjectId);

  const filteredSubjects = mockSubjects.filter((subj) =>
    assignedSubjectIds.includes(subj.id),
  );

  return filteredSubjects;
};

export const fetchGradingData = async (
  academicYearId,
  termId,
  classId,
  subjectId,
) => {
  await simulateDelay(700); // Slightly longer delay for main data

  // Simulate authorization check (based on mock assignments)
  const isAuthorized = mockTeacherAssignments.some(
    (assignment) =>
      assignment.teacherId === 99 && // Using mock teacher ID 99
      assignment.academicYearId === parseInt(academicYearId) &&
      assignment.termId === parseInt(termId) &&
      assignment.classId === parseInt(classId) &&
      assignment.subjectId === parseInt(subjectId),
  );

  if (!isAuthorized) {
    // Simulate forbidden error
    console.error(
      "Mock API: Teacher (ID 99) is not authorized for this selection.",
    );
    throw new Error("Not authorized to grade this subject/class combination.");
    // In a real app, you'd return a 403 status
  }

  // Select students based on the chosen class and year
  let studentsForClass = [];
  if (parseInt(classId) === 201 && parseInt(academicYearId) === 2) {
    studentsForClass = mockStudents_Grade8A;
  } else if (parseInt(classId) === 103 && parseInt(academicYearId) === 2) {
    // Adjust logic based on your mock data
    studentsForClass = mockStudents_SS3Science;
  } else {
    studentsForClass = []; // No students for other combinations in mock data
  }

  // Attach existing grades to students
  const studentsWithGrades = studentsForClass.map((student) => {
    const existingGrade = mockGrades.find(
      (grade) =>
        grade.studentId === student.id &&
        grade.subjectId === parseInt(subjectId) &&
        grade.termId === parseInt(termId) &&
        grade.academicYearId === parseInt(academicYearId),
    );
    return {
      ...student,
      grade: existingGrade
        ? { mark: existingGrade.mark, id: existingGrade.id }
        : null, // Only include mark and maybe ID
    };
  });

  return studentsWithGrades;
};

export const saveGrades = async (payload) => {
  await simulateDelay(1000); // Simulate save latency
  console.log("Mock API: Saving grades payload:", payload);
  // In a real app, you would process this payload, validate, and save to DB.
  // For the mock, we just log it and simulate success.

  // You could optionally update the mockGrades array in memory here
  // to see the changes reflected if you re-fetch, but for simplicity, we won't.

  return { success: true, message: "Grades saved successfully (mock)." };
};
