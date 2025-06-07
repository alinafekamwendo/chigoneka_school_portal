"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import teacherService from "@/service/teacher_service"; // Ensure this path is correct
 // Ensure this path is correct
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {toast} from "react-toastify"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Import Popover components
import { Calendar } from "@/components/ui/calendar"; // Import Calendar component
import CalendarIcon from "@mui/icons-material/CalendarToday"; // Import Calendar icon
import { cn } from "@/lib/utils"; // Import cn for conditional classnames
import { format } from "date-fns"; // Import format for date display
import {Teacher as TeacherDataFromAPI} from "../../types/teacher"

const EditTeacherPage = () => {
  const { id } = useParams(); // This 'id' is the teacher's ID
  const router = useRouter();

  // Initialize teacher state with null or a default structure
  const [teacher, setTeacher] = useState<TeacherDataFromAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tempQualification, setTempQualification] = useState("");
  const [tempSubject, setTempSubject] = useState("");

  // Sample data for qualifications and subjects (should match your backend expectations)
  const qualificationOptions = [
    "PhD",
    "Master's Degree",
    "Bachelor's Degree",
    "Teaching Certificate",
    "Diploma in Education",
  ];

  const subjectOptions = [
    "Mathematics",
    "English",
    "Science",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Art",
    "Music",
    "Physical Education",
  ];

  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No authentication token found");

        const teacherData = await teacherService.getTeacherById(
          id as string, // Cast id to string
          token,
        );
        // Ensure that qualifications and subjects are arrays
        teacherData.qualifications = teacherData.qualifications || [];
        teacherData.subjects = teacherData.subjects || [];

        setTeacher(teacherData);
        console.log("teacher data", teacherData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch teacher data.");
        toast.error(err.message || "Failed to fetch teacher data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTeacher();
    } else {
      setError("Teacher ID is missing.");
      setLoading(false);
    }
  }, [id, toast]); // Add toast to dependency array

  const handleArrayAdd = (
    field: "qualifications" | "subjects",
    value: string,
  ) => {
    if (value.trim() && teacher) {
      // Ensure value is not already in the array to prevent duplicates
      if (!teacher[field].includes(value.trim())) {
        setTeacher({
          ...teacher,
          [field]: [...teacher[field], value.trim()],
        });
        if (field === "qualifications") setTempQualification("");
        if (field === "subjects") setTempSubject("");
      } else {
        toast.error("Duplicate Entry");
      }
    }
  };

  const handleArrayRemove = (
    field: "qualifications" | "subjects",
    index: number,
  ) => {
    if (teacher) {
      const newArray = [...teacher[field]];
      newArray.splice(index, 1);
      setTeacher({ ...teacher, [field]: newArray });
    }
  };

  // Generic handler for direct input changes (firstName, lastName, email, phone, address)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (teacher) {
      setTeacher((prevTeacher) => {
        if (!prevTeacher) return null;
        return {
          ...prevTeacher,
          [name]: value, // <--- CORRECTED: Dynamically update the field
        };
      });
    }
  };

  // Handler for select changes (e.g., sex, isActive)
  const handleSelectChange = (
    value: boolean | string, // value will be 'MALE'/'FEMALE' for sex, or 'true'/'false' string for isActive
    name: keyof TeacherDataFromAPI, // 'sex' or 'isActive'
  ) => {
    if (teacher) {
      setTeacher((prevTeacher) => {
        if (!prevTeacher) return null;
        return {
          ...prevTeacher,
          [name]: value, // <--- CORRECTED: Dynamically update the field
        };
      });
    }
  };

  // Handler for date of birth chang
  const handleDateChange = (date: Date | undefined) => {
    if (teacher) {
      setTeacher((prevTeacher) => {
        if (!prevTeacher) return null;
        return {
          ...prevTeacher,
          dob: date, // <--- CORRECTED: Update the dob field
        };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No authentication token found");

      // Construct the data payload for updateTeacher service
      // This should match the `UpdateTeacherData` interface in your teacher_service.ts
      const updatePayload = {
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        username: teacher.username, // Include username if it can be updated
        email: teacher.email,
        phone: teacher.phone,
        sex: teacher.sex,
        isActive: teacher.isActive,
        address: teacher.address,
        dob: teacher.dob ? new Date(teacher.dob).toISOString() : undefined, // Convert to ISO string if date is provided

        qualifications: teacher.qualifications,
        subjects: teacher.subjects,
        // profilePhoto: teacher.user.profilePhoto, // If you allow updating profile photo
      };

      console.log("Sending update data:", updatePayload);

      // Call the updateTeacher service
      await teacherService.updateTeacher(teacher.id, updatePayload, token);

      toast.success("Teacher updated");
      router.push("/dashboard/admin/teachers/manage"); // Navigate back to manage page
    } catch (error: any) {
      toast.error(error.message || "Error updating teacher");
    }
  };

  if (loading)
    return <div className="py-8 text-center">Loading teacher data...</div>;
  if (error)
    return <div className="py-8 text-center text-red-500">Error: {error}</div>;
  if (!teacher)
    return <div className="py-8 text-center">Teacher not found.</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Editing teacher:
        <span className="capitalize text-green-500 "> {teacher.firstName}</span>
        <span className="pl-1 capitalize text-green-500">
          {" "}
          {teacher.lastName}
        </span>
      </h1>
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Information Section */}
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* First Name */}
            <div>
              <Label htmlFor="firstName">First Name*</Label>
              <Input
                id="firstName"
                name="firstName"
                value={teacher.firstName || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <Label htmlFor="lastName">Last Name*</Label>
              <Input
                id="lastName"
                name="lastName"
                value={teacher.lastName || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Username (assuming it can be updated, if not, make it readOnly) */}
            <div>
              <Label htmlFor="username">Username*</Label>
              <Input
                id="username"
                name="username"
                value={teacher.username || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={teacher.email || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone*</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={teacher.phone || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !teacher.dob && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {teacher.dob ? (
                      format(new Date(teacher.dob), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={teacher.dob ? new Date(teacher.dob) : undefined}
                    onSelect={handleDateChange}
                    initialFocus
                    fromYear={1960}
                    toYear={new Date().getFullYear() - 18} // Example: must be at least 18 years old
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Gender */}
            <div>
              <Label htmlFor="status">Status*</Label>
              <Select
                value={teacher.isActive ? "true" : "false"} // <--- Changed to "true"/"false" strings
                onValueChange={(value) => {
                  handleSelectChange(value === "true", "isActive");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Not Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sex">Gender*</Label>
              <Select
                value={teacher.sex || ""}
                onValueChange={(value) => handleSelectChange(value, "sex")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  {/* Add 'Other' if your backend supports it */}
                  {/* <SelectItem value="OTHER">Other</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Address*</Label>
            <Input
              id="address"
              name="address"
              value={teacher.address || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Teacher Information Section */}
          <h2 className="mb-4 mt-8 text-xl font-semibold text-gray-800">
            Teacher Specific Information
          </h2>

          {/* Qualifications */}
          <div>
            <Label>Qualifications*</Label>
            <div className="mb-2 flex gap-2">
              <Input
                value={tempQualification}
                onChange={(e) => setTempQualification(e.target.value)}
                placeholder="Add qualification"
                className="flex-grow"
              />
              <Button
                type="button"
                onClick={() =>
                  handleArrayAdd("qualifications", tempQualification)
                }
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {teacher.qualifications.map((qual, index) => (
                <span
                  key={index}
                  className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                >
                  {qual}
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("qualifications", index)}
                    className="ml-2 font-bold text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
              {teacher.qualifications.length === 0 && (
                <p className="text-sm text-red-500">
                  At least one qualification is required.
                </p>
              )}
            </div>
          </div>

          {/* Subjects */}
          <div>
            <Label>Subjects*</Label>
            <div className="mb-2 flex gap-2">
              <Input
                value={tempSubject}
                onChange={(e) => setTempSubject(e.target.value)}
                placeholder="Add subject"
                className="flex-grow"
              />
              <Button
                type="button"
                onClick={() => handleArrayAdd("subjects", tempSubject)}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {teacher.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("subjects", index)}
                    className="ml-2 font-bold text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
              {teacher.subjects.length === 0 && (
                <p className="text-sm text-red-500">
                  At least one subject is required.
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              name="bio"
              value={(teacher as any).bio || ""} // Assuming bio is part of user model
              onChange={handleChange}
              rows={3}
              placeholder="Tell us a little about the teacher..."
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/admin/teachers/manage")}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherPage;
