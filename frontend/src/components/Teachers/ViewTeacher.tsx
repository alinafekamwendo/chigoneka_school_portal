"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import teacherService from "@/service/teacher_service";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Teacher {
  id: string;
  qualifications: string[];
  subjects: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  phone?: string;
    dob?: string; // Date of birth, optional
    sex: "Male" | "Female";
    address: string;
    profilePhoto?: string;
  
}

const ViewTeacherPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No authentication token found");

        const teacherData = await teacherService.getTeacherById(
          id as string,
          token,
        );
        setTeacher(teacherData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch teacher",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!teacher) return <div className="p-4">Teacher not found</div>;

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-6 flex items-start justify-between">
        <h1 className="text-2xl font-bold">Teacher Profile</h1>
        <Button onClick={() => router.push(`/dashboard/admin/teachers/edit/${id}`)}>
          Edit Profile
        </Button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-shrink-0">
            <Avatar className="h-32 w-32">
              <AvatarImage src={teacher.profilePhoto} />
              <AvatarFallback>
                {teacher.firstName.charAt(0)}
                {teacher.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              {teacher.firstName} {teacher.lastName}
            </h2>
            <p className="mb-4 text-gray-600">{teacher.email}</p>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium text-gray-500">Username</h3>
                <p>{teacher.username}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Phone</h3>
                <p>{teacher.phone}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Gender</h3>
                <p>{teacher.sex}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Member Since</h3>
                <p>{new Date(teacher.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-500">Address</h3>
              <p>{teacher.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="mb-4 text-lg font-semibold">
            Professional Information
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium">Qualifications</h4>
              <ul className="space-y-1">
                {teacher.qualifications.map((qual, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2">•</span>
                    {qual}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-medium">Subjects</h4>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTeacherPage;
