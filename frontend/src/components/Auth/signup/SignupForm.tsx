"use client";
import React, { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import Compressor from "compressorjs";


const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  role: z.enum(["admin", "parent", "teacher", "student"]),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  sex: z.enum(["MALE", "FEMALE"]),
  profilePhoto: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Profile photo must be less than 5MB",
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPEG, PNG, and WebP images are allowed",
    )
    .optional(),
  level: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  subjects: z.array(z.string()).optional(),
  parentId: z.string().optional(),
  gradeLevel: z.string().optional(),
  currentClassId: z.string().optional(),
});

export default function SignupForm() {
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    role: "",
    password: "",
    address: "",
    email: "",
    phone: "",
    sex: "",
    profilePhoto: null as File | null,
    level: "regular",
    qualifications: [] as string[],
    subjects: [] as string[],
    parentId: "",
    gradeLevel: "",
    currentClassId: "",
  });

  const [tempQualification, setTempQualification] = useState("");
  const [tempSubject, setTempSubject] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
        success(result) {
          const compressedFile = new File([result], file.name, {
            type: result.type,
            lastModified: Date.now(),
          });
          setFormData((prev) => ({
            ...prev,
            profilePhoto: compressedFile,
          }));
        },
        error(err) {
          console.error("Error compressing image:", err);
          setError("Failed to compress the image. Please try again.");
        },
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayAdd = (
    field: "qualifications" | "subjects",
    tempValue: string,
  ) => {
    if (tempValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], tempValue.trim()],
      }));
      if (field === "qualifications") setTempQualification("");
      if (field === "subjects") setTempSubject("");
    }
  };

  const handleArrayRemove = (
    field: "qualifications" | "subjects",
    index: number,
  ) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      let validationData;
      if (formData.role === "admin") {
        validationData = signupSchema.pick({
          firstName: true,
          lastName: true,
          username: true,
          role: true,
          password: true,
          address: true,
          email: true,
          phone: true,
          sex: true,
          profilePhoto: true,
          level: true,
        });
      } else if (formData.role === "teacher") {
        validationData = signupSchema.pick({
          firstName: true,
          lastName: true,
          username: true,
          role: true,
          password: true,
          address: true,
          email: true,
          phone: true,
          sex: true,
          profilePhoto: true,
          qualifications: true,
          subjects: true,
        });
      } else if (formData.role === "student") {
        validationData = signupSchema.pick({
          firstName: true,
          lastName: true,
          username: true,
          role: true,
          password: true,
          address: true,
          email: true,
          phone: true,
          sex: true,
          profilePhoto: true,
          parentId: true,
          gradeLevel: true,
          currentClassId: true,
        });
      } else {
        validationData = signupSchema.pick({
          firstName: true,
          lastName: true,
          username: true,
          role: true,
          password: true,
          address: true,
          email: true,
          phone: true,
          sex: true,
          profilePhoto: true,
        });
      }

      validationData.parse(formData);
      setValidationErrors({});

     
   const formDataToSend = new FormData();

   // Add common fields - modified approach
   const addField = (name: string, value: any) => {
     if (value !== null && value !== undefined) {
       formDataToSend.append(name, value);
     }
   };

   // Handle common fields
   addField("firstName", formData.firstName);
   addField("lastName", formData.lastName);
   addField("username", formData.username);
   addField("role", formData.role);
   addField("password", formData.password);
   addField("address", formData.address);
   addField("email", formData.email);
   addField("phone", formData.phone);
   addField("sex", formData.sex);

   // Handle profile photo
   if (formData.profilePhoto) {
     formDataToSend.append("profilePhoto", formData.profilePhoto);
   }

   // Handle role-specific fields
   switch (formData.role) {
     case "admin":
       addField("level", formData.level);
       break;
     case "student":
       addField("parentId", formData.parentId);
       addField("gradeLevel", formData.gradeLevel);
       addField("currentClassId", formData.currentClassId);
       break;
     case "teacher":
       // Handle empty arrays - send empty array marker if empty
       if (formData.qualifications.length === 0) {
         formDataToSend.append("qualifications", "[]"); // Explicit empty array
       } else {
         formData.qualifications.forEach(
           (q) => formDataToSend.append("qualifications[]", q), // Note [] bracket notation
         );
       }

       if (formData.subjects.length === 0) {
         formDataToSend.append("subjects", "[]");
       } else {
         formData.subjects.forEach((s) =>
           formDataToSend.append("subjects[]", s),
         );
       }
       break;
   }

   // PROPER way to inspect FormData
   console.log("FormData contents:");
   for (const [key, value] of formDataToSend.entries()) {
     console.log(key, value);
   }

   const response = await axios.post(
     "http://localhost:5000/api/v1/auth/signup",
     formDataToSend,
     {
       headers: {
         "Content-Type": "multipart/form-data",
       },
       transformRequest: (data) => data, // Important for FormData
     },
   );

      if (response.data) {
        // Store only the token in localStorage
        localStorage.setItem("token", response.data.token);

        // Set user in context
        setUser(response.data.user);

        // Redirect to protected route
        router.push("/auth/login");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors = err.errors.reduce(
          (acc, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
          },
          {} as Record<string, string>,
        );
        setValidationErrors(errors);
      } else {
        let errorMessage = "Signup failed. Please try again.";
        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.message || errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
      <div className="bg-gradient mb-2 rounded-[10px] p-4 dark:bg-gray-dark dark:shadow-card">
        <div className="flex items-center justify-center  font-extrabold text-white">
          <h1>Mount Carmel of God Academy</h1>
        </div>
        <div className="mt-4 flex items-center justify-center ">
          <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
          <div className="block w-full min-w-fit px-2 text-center font-normal text-white dark:bg-gray-dark">
            <h2>Signup Form</h2>
          </div>
          <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        </div>
      </div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700 dark:bg-red-900 dark:text-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Common Fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="w-full rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
            />
            {validationErrors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="w-full rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
            />
            {validationErrors.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="w-full rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
          />
          {validationErrors.username && (
            <p className="mt-1 text-sm text-red-500">
              {validationErrors.username}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleSelectChange}
            className="w-full rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          {validationErrors.role && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.role}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone"
              className="w-full rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
            />
            {validationErrors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            className="w-full rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
          />
          {validationErrors.address && (
            <p className="mt-1 text-sm text-red-500">
              {validationErrors.address}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
            Sex
          </label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleSelectChange}
            className="w-full rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
          >
            <option value="">Select Sex</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {validationErrors.sex && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.sex}</p>
          )}
        </div>

        {/* Admin Specific Fields */}
        {formData.role === "admin" && (
          <div className="rounded-lg border p-4 dark:border-gray-600">
            <h3 className="mb-3 font-bold">Admin Information</h3>
            <div>
              <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
                Admin Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleSelectChange}
                className="w-full rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
              >
                <option value="regular">Regular Admin</option>
                <option value="super">Super Admin</option>
              </select>
            </div>
          </div>
        )}

        {/* Teacher Specific Fields */}
        {formData.role === "teacher" && (
          <div className="rounded-lg border p-4 dark:border-gray-600">
            <h3 className="mb-3 font-bold">Teacher Information</h3>
            <div className="mb-4">
              <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
                Qualifications
              </label>
              <div className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={tempQualification}
                  onChange={(e) => setTempQualification(e.target.value)}
                  placeholder="Add qualification"
                  className="flex-1 rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleArrayAdd("qualifications", tempQualification)
                  }
                  className="rounded-lg bg-primary px-4 py-3 text-white"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.qualifications.map((qual, index) => (
                  <div
                    key={index}
                    className="flex items-center rounded-full bg-gray-200 px-3 py-1 dark:bg-gray-700"
                  >
                    {qual}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove("qualifications", index)}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
                Subjects
              </label>
              <div className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={tempSubject}
                  onChange={(e) => setTempSubject(e.target.value)}
                  placeholder="Add subject"
                  className="flex-1 rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => handleArrayAdd("subjects", tempSubject)}
                  className="rounded-lg bg-primary px-4 py-3 text-white"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="flex items-center rounded-full bg-gray-200 px-3 py-1 dark:bg-gray-700"
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove("subjects", index)}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Student Specific Fields */}
        {formData.role === "student" && (
          <div className="rounded-lg border p-4 dark:border-gray-600">
            <h3 className="mb-3 font-bold">Student Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
                  Parent ID
                </label>
                <input
                  type="text"
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  placeholder="Enter parent's user ID"
                  className="w-full rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
                />
                {validationErrors.parentId && (
                  <p className="mt-1 text-sm text-red-500">
                    {validationErrors.parentId}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
                  Grade Level
                </label>
                <select
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleSelectChange}
                  className="w-full rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
                >
                  <option value="">Select Grade</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
                Class Assignment
              </label>
              <select
                name="currentClassId"
                value={formData.currentClassId}
                onChange={handleSelectChange}
                className="w-full rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
              >
                <option value="">Select Class</option>
                <option value="class1">Class 1</option>
                <option value="class2">Class 2</option>
              </select>
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-500">
              {validationErrors.password}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
            Profile Photo
          </label>
          <input
            type="file"
            name="profilePhoto"
            onChange={handleFileChange}
            className="w-full rounded-lg border border-gray-300 bg-transparent p-3 font-medium outline-none focus:border-primary dark:border-gray-600"
          />
          {validationErrors.profilePhoto && (
            <p className="mt-1 text-sm text-red-500">
              {validationErrors.profilePhoto}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-70"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-primary hover:underline"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
