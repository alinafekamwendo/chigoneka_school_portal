"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import adminService from "@/service/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, Phone, MapPin, User } from "lucide-react";

interface Admin {
  id: string;
  userId: string;
  level: "regular" | "super";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  // User properties
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  sex?: "MALE" | "FEMALE";
  address?: string;
  profilePhoto?: string | null;
  dob?: string | null;
  role: string;
}

export default function AdminProfilePage() {
  const { id } = useParams();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No authentication token found");

        const adminData = await adminService.getUserById(id as string, token);
        console.log("API Response:", adminData);

        if (!adminData) {
          throw new Error("Admin data not found");
        }

        setAdmin(adminData);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to fetch admin details",
          variant: "destructive",
        });
        router.push("/dashboard/admin/admins");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [id, router, toast]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Admin not found</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const fullName = `${admin.firstName} ${admin.lastName}`;
  const initials = getInitials(fullName);
  const profilePhoto = admin.profilePhoto || "/default-avatar.png";

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          <Button onClick={() => router.push("/dashboard/admin/admins/manage")}>
            Back to Admins
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardContent className="flex flex-col items-center p-6">
                <div className="relative mb-6">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profilePhoto} alt={fullName} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-4xl text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Badge
                    variant={admin.level === "super" ? "default" : "secondary"}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform"
                  >
                    {admin.level === "super" ? "Super Admin" : "Admin"}
                  </Badge>
                </div>

                <h2 className="text-center text-2xl font-semibold">
                  {fullName}
                </h2>
                <p className="mb-6 text-gray-500">@{admin.username}</p>

                <div className="w-full space-y-4">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">{admin.email}</span>
                  </div>

                  {admin.phone && (
                    <div className="flex items-center space-x-4">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">{admin.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <CalendarDays className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">
                      Joined {new Date(admin.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {admin.sex && (
                    <div className="flex items-center space-x-4">
                      <User className="h-5 w-5 text-gray-500" />
                      <span className="capitalize text-gray-700">
                        {admin.sex.toLowerCase()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Card */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      First Name
                    </h3>
                    <p className="mt-1 text-lg font-medium">
                      {admin.firstName}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Last Name
                    </h3>
                    <p className="mt-1 text-lg font-medium">{admin.lastName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Username
                    </h3>
                    <p className="mt-1 text-lg font-medium">
                      @{admin.username}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Admin Level
                    </h3>
                    <p className="mt-1 text-lg font-medium capitalize">
                      {admin.level === "super"
                        ? "Super Admin"
                        : "Regular Admin"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {admin.address && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{admin.address}</p>
                </CardContent>
              </Card>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={() =>
                  router.push(`/dashboard/admin/admins/edit/${id}`)
                }
                className="w-full"
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/admin/admins/manage")}
                className="w-full"
              >
                Back to List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
