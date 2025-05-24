// src/app/admin/add/page.tsx or src/components/Admin/AddAdminForm.tsx
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
import AlertSuccess from "../Alerts/AlertSuccess"; // Assuming you have shadcn/ui toast setup
import { cn } from "@/lib/utils";
import CalendarIcon from "@mui/icons-material/CalendarToday"; // Or use a lucide-react icon if preferred
import AlertError from "../Alerts/AlertError";
import { useToast } from "@/hooks/use-toast";

// Define the schema for form validation
const addAdminSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters." }),
  role: z.enum(["admin"], {
    errorMap: () => ({ message: "Please select a gender." }),
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(), // Assuming phone is optional based on model
  dob: z.date().optional(), // Assuming DOB is optional based on model
  address: z.string().optional(), // Assuming address is optional based on model
  sex: z.enum(["MALE", "FEMALE"], {
    errorMap: () => ({ message: "Please select a gender." }),
  }),
  adminLevel: z.enum(["regular", "super"], {
    errorMap: () => ({ message: "Please select an admin level." }),
  }),
});

type AddAdminFormValues = z.infer<typeof addAdminSchema>;


// Placeholder API function
const createAdmin = async (data: AddAdminFormValues) => {
  console.log("Creating admin with data:", data);
  // Replace with your actual API call to create a user and admin
  // Example:
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include authorization headers if needed
      },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to create admin");
  }
  return response.json();

  //Simulate API call success/failure
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        // Simulate 80% success rate
        resolve({ success: true, message: "Admin created successfully!" });
      } else {
        reject(
          new Error(
            "Failed to create admin. Username or email might already exist.",
          ),
        );
      }
    }, 1000);
  });
};

const AddAdminPage = () => {
  // Or AddAdminForm if used as a component
  const form = useForm<AddAdminFormValues>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      role: "admin",
      password: "",
      email: "",
      phone: "",
      dob: undefined,
      address: "",
      sex: undefined, // Use undefined for initial state of enum
      adminLevel: undefined, // Use undefined for initial state of enum
    },
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: AddAdminFormValues) => {
    setIsLoading(true);
    try {
      await createAdmin(values);
      toast({
        title: "Success",
        description: "Admin created successfully.",
        variant: "default",
        className: "bg-green-500",
      });
      form.reset(); // Clear the form on success
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="mb-2 text-center text-xl font-bold">Add New Admin</h1>
      <div className="mx-auto max-w-md  bg-white p-6 shadow-md">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <Label htmlFor="firstName">First Name</Label>
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
              <Label htmlFor="lastName">Last Name</Label>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>
          {/* Username */}
          <div className="grid grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
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
                type="tel" // Use type tel for phone
                {...form.register("phone")}
                className={form.formState.errors.phone && "border-red-500"}
              />
              {form.formState.errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
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
                  onSelect={(date) => form.setValue("dob", date!)} // Use setValue from react-hook-form
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

          <div className="grid grid-cols-2 gap-4">
            {/* Sex */}
            <div>
              <Label htmlFor="sex">Gender</Label>
              <Select
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
                onValueChange={(value: "regular" | "super") =>
                  form.setValue("adminLevel", value)
                }
              >
                <SelectTrigger
                  className={
                    form.formState.errors.adminLevel && "border-red-500"
                  }
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
          </div>

          <Button
            type="submit"
            className="hover:bg- w-full bg-blue-500"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Admin"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddAdminPage;
