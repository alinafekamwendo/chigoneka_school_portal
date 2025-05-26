"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";98

// Define the schema for form validation
const addTeacherSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters." }),
  role: z.literal("teacher"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." }),
  dob: z.date().optional(),
  address: z.string().min(1, { message: "Address is required." }),
  sex: z.enum(["MALE", "FEMALE"], {
    errorMap: () => ({ message: "Please select a gender." }),
  }),
  qualifications: z
    .array(z.string())
    .nonempty({ message: "At least one qualification is required." }),
  subjects: z
    .array(z.string())
    .nonempty({ message: "At least one subject is required." }),
  bio: z.string().optional(),
  profilePhoto: z.instanceof(File).optional(),
});

type AddTeacherFormValues = z.infer<typeof addTeacherSchema>;

const AddTeacherPage = () => {
  const form = useForm<AddTeacherFormValues>({
    resolver: zodResolver(addTeacherSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      role: "teacher",
      password: "",
      email: "",
      phone: "",
      dob: undefined,
      address: "",
      sex: undefined,
      qualifications: [],
      subjects: [],
      bio: "",
    },
  });

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Sample data for qualifications and subjects
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("profilePhoto", file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: AddTeacherFormValues) => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      // Append all basic fields
      Object.keys(values).forEach((key) => {
        if (
          key !== "qualifications" &&
          key !== "subjects" &&
          key !== "profilePhoto"
        ) {
          formData.append(
            key,
            values[key as keyof AddTeacherFormValues] as string,
          );
        }
      });

      // Append arrays as comma-separated strings
      formData.append("qualifications", values.qualifications.join(","));
      formData.append("subjects", values.subjects.join(","));

      // Append file if exists
      if (values.profilePhoto) {
        formData.append("profilePhoto", values.profilePhoto);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`,
        {
          method: "POST",
          body: formData, // No Content-Type header needed for FormData
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create teacher");
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: "Teacher created successfully.",
        variant: "default",
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create teacher.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-center text-2xl font-bold">Add New Teacher</h1>
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={previewImage || "/default-avatar.png"}
                alt="Profile preview"
                className="h-24 w-24 rounded-full object-cover"
              />
              <label
                htmlFor="profilePhoto"
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600"
              >
                <span className="text-white">+</span>
                <input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* First Name */}
            <div>
              <Label htmlFor="firstName">First Name*</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                className={
                  form.formState.errors.firstName ? "border-red-500" : ""
                }
              />
              {form.formState.errors.firstName && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <Label htmlFor="lastName">Last Name*</Label>
              <Input
                id="lastName"
                {...form.register("lastName")}
                className={
                  form.formState.errors.lastName ? "border-red-500" : ""
                }
              />
              {form.formState.errors.lastName && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <Label htmlFor="username">Username*</Label>
              <Input
                id="username"
                {...form.register("username")}
                className={
                  form.formState.errors.username ? "border-red-500" : ""
                }
              />
              {form.formState.errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                className={form.formState.errors.email ? "border-red-500" : ""}
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password*</Label>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                className={
                  form.formState.errors.password ? "border-red-500" : ""
                }
              />
              {form.formState.errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone*</Label>
              <Input
                id="phone"
                type="tel"
                {...form.register("phone")}
                className={form.formState.errors.phone ? "border-red-500" : ""}
              />
              {form.formState.errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.phone.message}
                </p>
              )}
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
                      !form.watch("dob") && "text-muted-foreground",
                      form.formState.errors.dob && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("dob") ? (
                      format(form.watch("dob") as Date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch("dob") as Date}
                    onSelect={(date) => form.setValue("dob", date!)}
                    initialFocus
                    fromYear={1960}
                    toYear={new Date().getFullYear() - 18}
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.dob && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.dob.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <Label htmlFor="sex">Gender*</Label>
              <Select
                onValueChange={(value: "MALE" | "FEMALE") =>
                  form.setValue("sex", value)
                }
              >
                <SelectTrigger
                  className={form.formState.errors.sex ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.sex && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.sex.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Address*</Label>
            <Input
              id="address"
              {...form.register("address")}
              className={form.formState.errors.address ? "border-red-500" : ""}
            />
            {form.formState.errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          {/* Qualifications */}
          <div>
            <Label>Qualifications*</Label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {qualificationOptions.map((qualification) => (
                <div
                  key={qualification}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id={`qualification-${qualification}`}
                    value={qualification}
                    checked={form
                      .watch("qualifications")
                      .includes(qualification)}
                    onChange={(e) => {
                      const currentQualifications =
                        form.watch("qualifications");
                      if (e.target.checked) {
                        form.setValue("qualifications", [
                          ...currentQualifications,
                          qualification,
                        ]);
                      } else {
                        form.setValue(
                          "qualifications",
                          currentQualifications.filter(
                            (q) => q !== qualification,
                          ),
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`qualification-${qualification}`}>
                    {qualification}
                  </Label>
                </div>
              ))}
            </div>
            {form.formState.errors.qualifications && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.qualifications.message}
              </p>
            )}
          </div>

          {/* Subjects */}
          <div>
            <Label>Subjects*</Label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {subjectOptions.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`subject-${subject}`}
                    value={subject}
                    checked={form.watch("subjects").includes(subject)}
                    onChange={(e) => {
                      const currentSubjects = form.watch("subjects");
                      if (e.target.checked) {
                        form.setValue("subjects", [
                          ...currentSubjects,
                          subject,
                        ]);
                      } else {
                        form.setValue(
                          "subjects",
                          currentSubjects.filter((s) => s !== subject),
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`subject-${subject}`}>{subject}</Label>
                </div>
              ))}
            </div>
            {form.formState.errors.subjects && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.subjects.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              {...form.register("bio")}
              rows={3}
              placeholder="Tell us a little about the teacher..."
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Creating Teacher..." : "Create Teacher"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherPage;
