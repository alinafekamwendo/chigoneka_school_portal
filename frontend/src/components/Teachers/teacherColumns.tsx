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
import { LuPhone } from "react-icons/lu";



 // Your defined type
 export interface Teacher {
   id: string; // The ID of the teacher record itself
   staffNumber: string; // The ID of the associated user record
   qualifications: string[];
   subjects: string[];
   createdAt: string;
   updatedAt: string;
   deletedAt?: string;
   firstName: string;
   lastName: string;
   username: string;
   email: string;
   phone?: string;
   isActive?: boolean;
   sex?: "Male" | "Female"; // Matching backend definition
   address?: string;
   profilePhoto?: string;
 }


export const teacherColumns: ColumnDef<Teacher>[] = [
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

  // Qualifications
  {
    accessorKey: "qualifications",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Qualifications
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="items-center">{row.getValue("qualifications")}</div>
      );
    },
  },
  // staffnumber Column (with sorting)
  {
    accessorKey: "staffNumber",
    header: ({ column }) => {
      return (
        <Button
          className="text-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Staff Number
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="rounded p-1  uppercase">
          {row.getValue("staffNumber")}
        </div>
      );
    },
  },
  // staffnumber Column (with sorting)
  {
    accessorKey: "subjects",
    header: ({ column }) => {
      return (
        <Button
          className="text-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Majors
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="rounded p-1  uppercase">{row.getValue("subjects")}</div>
      );
    },
  },
  // staffnumber Column (with sorting)
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          className="text-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
         Phone
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="rounded p-1  flex flex-row items-center ">
          <LuPhone
            
            className="mr-2  text-green-500 "
            aria-hidden="true"
          /> {row.getValue("phone") || "N/A"}
        </div>
      );
    },
  },
  // staffnumber Column (with sorting)
  
  // staffnumber Column (with sorting)
  
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
        </Button>
      );
      
    },
    cell: ({ row }) => {
      const status = row.getValue("isActive");
      console.log("status",status)
      const backgroundColor =
        status? "bg-green-500" : "bg-red-500";
      return (
        <div className={`items-center  ${backgroundColor} rounded p-1`}>
          {row.getValue("isActive")}
        </div>
      );

    },
   
  },
  // Actions Column
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const teacher = row.original;
      const router = useRouter();

      function copyAdmin(teacher: string): void {
        try {
          navigator.clipboard.writeText(teacher);
          toast.success("Teacher ID copied to clipboard", {
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
        teacher: Teacher,
      ): React.MouseEventHandler<HTMLDivElement> {
        return () => {
          router.push(`/dashboard/admin/teachers/edit/${teacher.id}`);
        };
      }
      function handleView(
        admin: Teacher,
      ): React.MouseEventHandler<HTMLDivElement> {
        return () => {
          router.push(`/dashboard/admin/teachers/view/${admin.id}`);
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
              onClick={() => copyAdmin(teacher.toString())}
            >
              Copy Admin ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="bg-blue-400 text-white"
              onClick={handleView(teacher)}
            >
              View Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              className=" bg-red-400 text-white"
              onClick={handleEdit(teacher)}
            >
              Edit Admin details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
