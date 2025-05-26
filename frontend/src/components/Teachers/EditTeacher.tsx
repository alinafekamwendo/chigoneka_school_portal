"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import teacherService from "@/service/teacher_service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Teacher {
  id: string;
  qualifications: string[];
  subjects: string[];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    sex: "MALE" | "FEMALE";
    address: string;
    profilePhoto?: string;
  };
}

const EditTeacherPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tempQualification, setTempQualification] = useState("");
  const [tempSubject, setTempSubject] = useState("");

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

  const handleArrayAdd = (
    field: "qualifications" | "subjects",
    value: string,
  ) => {
    if (value.trim() && teacher) {
      setTeacher({
        ...teacher,
        [field]: [...teacher[field], value.trim()],
      });
      if (field === "qualifications") setTempQualification("");
      if (field === "subjects") setTempSubject("");
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (teacher) {
      setTeacher({
        ...teacher,
        user: {
          ...teacher.user,
          [name]: value,
        },
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (teacher) {
      setTeacher({
        ...teacher,
        user: {
          ...teacher.user,
          [name]: value,
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No authentication token found");

      // Update user info
      const userUpdate = {
        firstName: teacher.user.firstName,
        lastName: teacher.user.lastName,
        username: teacher.user.username,
        email: teacher.user.email,
        phone: teacher.user.phone,
        sex: teacher.user.sex,
        address: teacher.user.address,
        qualifilactions: teacher.qualifications,
        subjects: teacher.subjects,
      };

      // Update teacher-specific info
      // const teacherUpdate = {
      //   qualifications: teacher.qualifications,
      //   subjects: teacher.subjects,
      // };

     
       // teacherService.updateUser(teacher.user.id, userUpdate, token),
        teacherService.updateTeacher(teacher.id, userUpdate, token),


      toast({
        title: "Teacher updated",
        description: "The teacher has been successfully updated.",
        duration: 3000,
      });
      router.push("/dashboard/admin/teachers/manage");
    } catch (error) {
      toast({
        title:
          error instanceof Error ? error.message : "Failed to update teacher",
        description: "Please try again later.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!teacher) return <div className="p-4">Teacher not found</div>;

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Edit Teacher</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={teacher.user.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={teacher.user.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={teacher.user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={teacher.user.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            value={teacher.user.address}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="sex">Gender</Label>
          <select
            id="sex"
            name="sex"
            value={teacher.user.sex}
            onChange={handleSelectChange}
            className="w-full rounded border p-2"
            required
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div className="border-t pt-4">
          <h2 className="mb-4 text-xl font-semibold">Teacher Information</h2>

          <div className="mb-4">
            <Label>Qualifications</Label>
            <div className="mb-2 flex gap-2">
              <Input
                value={tempQualification}
                onChange={(e) => setTempQualification(e.target.value)}
                placeholder="Add qualification"
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
                <div
                  key={index}
                  className="flex items-center rounded-full bg-gray-100 px-3 py-1"
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
            <Label>Subjects</Label>
            <div className="mb-2 flex gap-2">
              <Input
                value={tempSubject}
                onChange={(e) => setTempSubject(e.target.value)}
                placeholder="Add subject"
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
                <div
                  key={index}
                  className="flex items-center rounded-full bg-gray-100 px-3 py-1"
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

        <div className="flex justify-end gap-2 pt-4">
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
  );
};

export default EditTeacherPage;
