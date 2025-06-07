// app/payments/columns.tsx (or wherever you define columns for a specific table)
"use client";

import { ColumnDef, RowExpanding } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { toast } from "react-toastify";
import adminService from "@/service/admin";


import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { get } from "http";

 // Your defined type
 interface Admin {
   id: string;
  role: String;
   createdAt: string;
   updatedAt: string;
   deletedAt: string | null;
   user: {
     id: string;
     firstName: string;
     lastName: string;
     username: string;
     email: string;
     phone?: string;
     sex?: "MALE" | "FEMALE";
     address?: string;
     profilePhoto?: string;
   };
 }


export const adminColumns: ColumnDef<Admin>[] = [
  // Selection Column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // Amount Column (with sorting)
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="lowercase ">{row.getValue("email")}</div>;
    },
  },
  // Status Column (with filtering via accessorKey)
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("username")}</div>
    ),
  },
  // Role Column (with sorting and filtering via accessorKey)
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role  = row.getValue("role");
      const backgroundColor = role === "Super Admin" ? "bg-green-500" : "bg-blue-500";
      return (
        <div className={`lowercase ${backgroundColor} rounded p-1 text-white  `}>
          {role}
        </div>
      );
    },
  },
  // Client Name Column
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  // Actions Column
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const admin = row.original;
      const router = useRouter();

      function copyAdmin(admin: string): void {
        try {
          navigator.clipboard.writeText(admin);
          toast.success("Admin ID copied to clipboard", {
            position: "bottom-right",
            autoClose: 1000,
          });
        } catch (error) {
          toast.error("Failed to copy Admin ID", {
            position: "bottom-right",
            autoClose: 1000,
          });
        }
      }

      function handleEdit(
        admin: Admin,
      ): React.MouseEventHandler<HTMLDivElement> {
        return () => {
          router.push(`/dashboard/admin/admins/edit/${admin.id}`);
        };
      }
      function handleView(
        admin: Admin,
      ): React.MouseEventHandler<HTMLDivElement> {
        return () => {
          router.push(`/dashboard/admin/admins/view/${admin.id}`);
        };
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="bg-green-400 text-white"
              onClick={() => copyAdmin(admin.toString())}
            >
              Copy Admin ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="bg-blue-400 text-white"
              onClick={handleView(admin)}
            >
              View Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              className=" bg-red-400 text-white"
              onClick={handleEdit(admin)}
            >
              Edit Admin details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
