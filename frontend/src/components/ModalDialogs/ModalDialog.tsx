"use client";

import React, { useState } from "react";

interface ModalDialogProps {
  title: string;
  role: "student" | "teacher" | "parent"|"admin"; // Add role prop
  onSubmit: (data: Record<string, any>) => void;
  onClose: () => void;
}

const ModalDialog: React.FC<ModalDialogProps> = ({
  title,
  role,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, role }); // Include role in the submitted data
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 mt-12 w-full max-w-md rounded-lg bg-white shadow-lg dark:bg-gray-800">
        {/* Fixed Header */}
        <div className="border-b p-4">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>

        {/* Scrollable Form Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            {/* Common Fields */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password || ""}
                onChange={handleInputChange}
                className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Role-Specific Fields */}
            {role === "teacher" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Qualifications
                  </label>
                  <input
                    type="text"
                    name="qualifications"
                    value={formData.qualifications || ""}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Subjects
                  </label>
                  <input
                    type="text"
                    name="subjects"
                    value={formData.subjects || ""}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}

            {/* Add more fields here as needed */}
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="border-t p-4">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 dark:bg-gray-600 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDialog;