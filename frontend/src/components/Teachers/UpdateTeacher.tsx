// src/app/admin/edit/[id]/page.tsx or src/components/Admin/UpdateAdminForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import adminService from "@/service/admin";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AlertError from "../Alerts/AlertError";
import AlertSuccess from "../Alerts/AlertSuccess";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar"; // Or use a lucide-react icon

// Define the schema for validation (similar to add, but password can be optional for update)
const updateAdminSchema = z.object({
  id: z.string().uuid({ message: "Invalid admin ID." }), // Assuming admin ID is passed
  userId: z.string().uuid({ message: "Invalid user ID." }), // Assuming user ID is needed for update
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .optional()
    .or(z.literal("")), // Password can be empty string or optional
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(),
  dob: z.date().optional().nullable(), // Allow null for date if optional
  address: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"], {
    errorMap: () => ({ message: "Please select a gender." }),
  }),
  adminLevel: z.enum(["regular", "super"], {
    errorMap: () => ({ message: "Please select an admin level." }),
  }),
});

type UpdateAdminFormValues = z.infer<typeof updateAdminSchema>;

// Placeholder API functions
const fetchAdminData = async (adminId: string) => {
  console.log("Fetching admin data for ID:", adminId);
  // Replace with your actual API call to fetch admin and user data
  // Example:
  const response = await fetch(`/api/admin/${adminId}`, {
    headers: {
      // Include authorization headers if needed
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch admin data');
  }
  return response.json(); // Should return data matching UpdateAdminFormValues (excluding password)

 // Simulate API call
  return new Promise<UpdateAdminFormValues>((resolve) => {
    setTimeout(() => {
      resolve({
        id: adminId,
        userId: "some-user-id", // Replace with a mock user ID
        firstName: "Existing",
        lastName: "Admin",
        username: "existing.admin",
        // password is not fetched for security
        email: "existing.admin@example.com",
        phone: "123-456-7890",
        dob: new Date("1990-05-17"), // Example date
        address: "123 Admin St",
        sex: "FEMALE",
        adminLevel: "regular",
      });
    }, 1000);
  });
};

const updateAdmin = async (data: UpdateAdminFormValues) => {
  console.log("Updating admin with data:", data);
  // Replace with your actual API call to update user and admin
  // Example:
  // const response = await fetch(`/api/admin/${data.id}`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     // Include authorization headers if needed
  //   },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) {
  //   throw new Error('Failed to update admin');
  // }
  // return response.json();

  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        // Simulate 90% success rate
        resolve({ success: true, message: "Admin updated successfully!" });
      } else {
        reject(
          new Error(
            "Failed to update admin. Username or email might already exist.",
          ),
        );
      }
    }, 1000);
  });
};

// If this is a page component in Next.js app directory, it receives params
const UpdateAdminPage = ({ params }: { params: { id: string } }) => {
  // Or UpdateAdminForm component
  const adminId = params.id; // Get the admin ID from the URL params

  const form = useForm<UpdateAdminFormValues>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      // Default values will be set after fetching data
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch admin data on component mount
  useEffect(() => {
    const loadAdminData = async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const data = await fetchAdminData(adminId);
        form.reset({
          // Use form.reset to set default values after fetching
          ...data,
          // Ensure dob is a Date object if it comes as a string
          dob: data.dob ? new Date(data.dob) : undefined,
          // Handle potential null/undefined values from API if they exist
          phone: data.phone ?? "",
          address: data.address ?? "",
        });
      } catch (error: any) {
        setFetchError(error.message || "Failed to load admin data.");
        AlertError({
          title: "Error",
          message: error.message || "Failed to load admin data.",
        });
      } finally {
        setIsFetching(false);
      }
    };

    if (adminId) {
      loadAdminData();
    } else {
      setFetchError("Admin ID is missing.");
      setIsFetching(false);
    }
  }, [adminId, form]); // Depend on adminId and form (form is stable)

  const onSubmit = async (values: UpdateAdminFormValues) => {
    setIsLoading(true);
    try {
      // Filter out the password if it's an empty string or undefined,
      // so you don't update the password if the field is left blank
      const dataToUpdate = { ...values };
      if (dataToUpdate.password === "" || dataToUpdate.password === undefined) {
        delete dataToUpdate.password;
      }

      await updateAdmin(dataToUpdate);
      AlertSuccess({
        title: "Success",
        message: "Admin updated successfully.",
      });
      // Optionally, navigate back to a list page or show a success message
    } catch (error: any) {
      AlertError({
        title: "Error",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="container mx-auto py-8 text-center">
        Loading admin data...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mx-auto py-8 text-center text-red-500">
        {fetchError}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">Update Admin</h1>
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Hidden fields for IDs */}
          <input type="hidden" {...form.register("id")} />
          <input type="hidden" {...form.register("userId")} />

          {/* First Name */}
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...form.register("firstName")}
              className={form.formState.errors.firstName && "border-red-500"}
            />
            {form.formState.errors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...form.register("lastName")}
              className={form.formState.errors.lastName && "border-red-500"}
            />
            {form.formState.errors.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...form.register("username")}
              className={form.formState.errors.username && "border-red-500"}
            />
            {form.formState.errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              className={form.formState.errors.email && "border-red-500"}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password (Optional for Update) */}
          <div>
            <Label htmlFor="password">
              Password (Leave blank to keep current)
            </Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
              className={form.formState.errors.password && "border-red-500"}
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Phone (Optional) */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              {...form.register("phone")}
              className={form.formState.errors.phone && "border-red-500"}
            />
            {form.formState.errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          {/* Date of Birth (Optional) */}
          <div>
            <Label htmlFor="dob">Date of Birth (Optional)</Label>
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
                  <Calendar className="mr-2 h-4 w-4" />
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
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.dob && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.dob.message}
              </p>
            )}
          </div>

          {/* Address (Optional) */}
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...form.register("address")}
              className={form.formState.errors.address && "border-red-500"}
            />
            {form.formState.errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.address.message}
              </p>
            )}
          </div>

          {/* Sex */}
          <div>
            <Label htmlFor="sex">Gender</Label>
            <Select
              value={form.watch("sex")}
              onValueChange={(value: "MALE" | "FEMALE") =>
                form.setValue("sex", value)
              }
            >
              <SelectTrigger
                className={form.formState.errors.sex && "border-red-500"}
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">MALE</SelectItem>
                <SelectItem value="FEMALE">FEMALE</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.sex && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.sex.message}
              </p>
            )}
          </div>

          {/* Admin Level */}
          <div>
            <Label htmlFor="adminLevel">Admin Level</Label>
            <Select
              value={form.watch("adminLevel")}
              onValueChange={(value: "regular" | "super") =>
                form.setValue("adminLevel", value)
              }
            >
              <SelectTrigger
                className={form.formState.errors.adminLevel && "border-red-500"}
              >
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="super">Super</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.adminLevel && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.adminLevel.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Admin"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAdminPage;
