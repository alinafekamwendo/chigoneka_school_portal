
"use client";

import React, { useState, useMemo, ChangeEvent } from "react";
import {
  FaEye,
  FaTrash,
  FaPlus,
  FaSort,
  FaEdit,
  FaEllipsisV,
} from "react-icons/fa";
import { useRouter } from "next/navigation"; // Import useRouter
import ModalDialog from "../ModalDialogs/ModalDialog"; // Import the reusable modal

interface TableProps {
  title: string;
  role: "student" | "teacher" | "parent" | "admin"; // Add role prop
  columns: string[];
  data: Record<string, any>[];
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

const Table: React.FC<TableProps> = ({ title, role, columns, data }) => {
  const router = useRouter(); // Initialize useRouter
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(5);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState<boolean>(false); // State for delete confirmation

  const [rowToDelete, setRowToDelete] = useState<Record<string, any> | null>(
    null,
  ); // Track the row to delete

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = (column: string) => {
    const key = column.toLowerCase().replace(/ /g, "_");
    setSortConfig((prev) =>
      prev && prev.key === key && prev.direction === "asc"
        ? { key, direction: "desc" }
        : { key, direction: "asc" },
    );
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const numberOfRecords = filteredData.length;

  // Handle View
  const handleView = (row: Record<string, any>) => {
    // Navigate to the profile page with the row ID
    
    router.push(`/dashboard/admin/profiles/${row.id}`);
  };

  // Floating menu handlers
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDeleteAll = () => {
    alert("Delete All functionality");
    setIsMenuOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddStudent = async (formData: Record<string, string>) => {
    try {
      // Replace with your backend API endpoint
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Student added successfully!");
        closeModal();
        // Optionally, refresh the table data here
      } else {
        alert("Failed to add student.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the student.");
    }
  };

  // Delete confirmation handlers
  const openDeleteConfirmation = (row: Record<string, any>) => {
    setRowToDelete(row); // Set the row to delete
    setIsDeleteConfirmationOpen(true); // Open the confirmation dialog
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false); // Close the confirmation dialog
    setRowToDelete(null); // Reset the row to delete
  };

  const handleDeleteRow = async () => {
    if (!rowToDelete) return;

    try {
      // Replace with your backend API endpoint
      const response = await fetch(`/api/students/${rowToDelete.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Row deleted successfully!");
        closeDeleteConfirmation();
        // Optionally, refresh the table data here
      } else {
        alert("Failed to delete row.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the row.");
    }
  };

  return (
    <div className="rounded-md bg-white p-4 shadow-md dark:bg-gray-800">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}s
          </h4>
          <p>{numberOfRecords} records</p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full rounded border border-gray-300 px-3 py-2 text-black dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
          <button
            className="rounded bg-blue-500 p-2 text-white"
            onClick={toggleMenu}
          >
            <FaEllipsisV />
          </button>

          {/* Floating Menu */}
          {isMenuOpen && (
            <div className="absolute right-4 mt-12 w-48 rounded-lg bg-white shadow-lg dark:bg-gray-700">
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                onClick={openModal}
              >
                <FaPlus />
                Add {title}
              </button>
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={handleDeleteAll}
              >
                <FaTrash />
                Delete All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="cursor-pointer px-4 py-2 font-semibold text-gray-700 dark:text-white"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-1">
                    {/* <FaSort className="text-gray-600 dark:text-gray-300" /> */}
                    {column}
                  </div>
                </th>
              ))}
              <th className="px-4 py-2 text-gray-700 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, key) => (
                <tr
                  key={key}
                  className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  {columns.map((column, index) => (
                    <td
                      key={index}
                      className="px-4 py-3 text-gray-900 dark:text-white"
                    >
                      {column.toLowerCase() === "username" ? (
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{row.username}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                              {row.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        row[column.toLowerCase().replace(/ /g, "_")]
                      )}
                    </td>
                  ))}
                  <td className="flex gap-3 px-4 py-3">
                    <button
                      className="rounded bg-gray-200 p-2 dark:bg-gray-700"
                      onClick={() => handleView(row)} // Call handleView on click
                    >
                      <FaEye className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                      className="rounded bg-blue-500 p-2"
                      onClick={() => openDeleteConfirmation(row)}
                    >
                      <FaEdit className="text-white" />
                    </button>
                    <button
                      className="rounded bg-red-500 p-2"
                      onClick={() => openDeleteConfirmation(row)} // Open confirmation dialog
                    >
                      <FaTrash className="text-white" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-3 text-center text-gray-500 dark:text-gray-300"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reusable Modal */}
      {isModalOpen && (
        <ModalDialog
          title={`Add ${title}`}
          role={role} // Pass the role
          onSubmit={async (data) => {
            try {
              const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              });
              if (response.ok) {
                alert("User created successfully!");
                closeModal();
              } else {
                alert("Failed to create user.");
              }
            } catch (error) {
              console.error("Error:", error);
              alert("An error occurred while creating the user.");
            }
          }}
          onClose={closeModal}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Confirm Deletion</h2>
            <p className="mb-6 text-gray-700 dark:text-white">
              Are you sure you want to delete this {title}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteConfirmation}
                className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 dark:bg-gray-600 dark:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteRow}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
