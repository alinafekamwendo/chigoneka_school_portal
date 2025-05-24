"use client";
import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Visibility, Edit, Delete, Download } from "@mui/icons-material";
import { Button, Menu, MenuItem, IconButton } from "@mui/material";
import * as XLSX from "xlsx"; // For Excel export
import jsPDF from "jspdf";
import "jspdf-autotable";// For PDF export

interface Row {
  id: number;
  userName: string;
  contact: string;
  age: number;
  country: string;
  status: string;
}

const rows: Row[] = [
  {
    id: 1,
    userName: "Alice Johnson",
    contact: "alice@example.com",
    age: 25,
    country: "USA",
    status: "Verified",
  },
  {
    id: 2,
    userName: "Bob Smith",
    contact: "bob@example.com",
    age: 30,
    country: "UK",
    status: "Rejected",
  },
  {
    id: 3,
    userName: "Charlie Brown",
    contact: "charlie@example.com",
    age: 28,
    country: "Canada",
    status: "Pending",
  },
  {
    id: 4,
    userName: "Charlie Brown",
    contact: "charlie@example.com",
    age: 28,
    country: "Canada",
    status: "Pending",
  },
  {
    id: 5,
    userName: "Charlie Brown",
    contact: "charlie@example.com",
    age: 28,
    country: "Canada",
    status: "Pending",
  },
  {
    id: 6,
    userName: "Charlie Brown",
    contact: "charlie@example.com",
    age: 28,
    country: "Canada",
    status: "Pending",
  },
  {
    id: 7,
    userName: "Charlie Brown",
    contact: "charlie@example.com",
    age: 28,
    country: "Canada",
    status: "Pending",
  },
];

const columns: GridColDef[] = [
  { field: "id", headerName: "#", width: 50 },
  { field: "userName", headerName: "USER NAME", flex: 1 },
  { field: "contact", headerName: "CONTACT", flex: 1 },
  { field: "age", headerName: "AGE", width: 70, type: "number" },
  { field: "country", headerName: "COUNTRY", flex: 1 },
  {
    field: "status",
    headerName: "STATUS",
    flex: 1,
    renderCell: (params) => (
      <span
        className={`rounded px-2 py-1 text-sm text-white ${
          params.value === "Verified"
            ? "bg-green-500"
            : params.value === "Rejected"
              ? "bg-red-500"
              : "bg-yellow-500"
        }`}
      >
        {params.value}
      </span>
    ),
  },
  {
    field: "actions",
    headerName: "ACTIONS",
    width: 150,
    renderCell: () => (
      <div className="flex space-x-2 ">
        <button className="rounded p-2 text-blue-500 hover:bg-blue-100 ">
          <Visibility />
        </button>
        <button className="rounded p-2 text-yellow-500 hover:bg-yellow-100">
          <Edit />
        </button>
        <button className="rounded p-2 text-red-500 hover:bg-red-100">
          <Delete />
        </button>
      </div>
    ),
  },
];

const ResponsiveDataTable: React.FC = () => {
  const [filterText, setFilterText] = useState<string>("");
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const isMenuOpen = Boolean(anchorEl);

  const handleExport = (): void => {
    alert("Export table to CSV!");
  };

  const filteredRows = rows.filter(
    (row) =>
      row.userName.toLowerCase().includes(filterText.toLowerCase()) ||
      row.contact.toLowerCase().includes(filterText.toLowerCase()) ||
      row.country.toLowerCase().includes(filterText.toLowerCase()) ||
      row.status.toLowerCase().includes(filterText.toLowerCase()),
  );

  // Export to CSV
  const exportToCSV = () => {
    const csvData = filteredRows.map((row) => ({
      ID: row.id,
      "User Name": row.userName,
      Contact: row.contact,
      Age: row.age,
      Country: row.country,
      Status: row.status,
    }));
    const csvString = [
      Object.keys(csvData[0]).join(","), // Header row
      ...csvData.map((row) => Object.values(row).join(",")), // Data rows
    ].join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "table_data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    XLSX.writeFile(workbook, "table_data.xlsx");
  };

  // Export to PDF
 const exportToPDF = () => {
   try {
     const doc = new jsPDF();

     // Set Title
     doc.text("Table Data Export", 14, 10);

     // Define Table Columns and Rows
     const tableColumnHeaders = [
       "ID",
       "User Name",
       "Contact",
       "Age",
       "Country",
       "Status",
     ];
     const tableRows = filteredRows.map((row) => [
       row.id,
       row.userName,
       row.contact,
       row.age,
       row.country,
       row.status,
     ]);

     // Debugging: Check Data Before PDF Generation
     console.log("Exporting to PDF with data:", tableRows);

     // Generate Table with autoTable
     doc.autoTable({
       head: [tableColumnHeaders],
       body: tableRows,
       startY: 20, // Start the table below the title
       theme: "grid", // Apply a simple grid theme
       headStyles: { fillColor: [22, 160, 133] }, // Optional: Customize header color
     });

     // Save PDF
     doc.save("table_data.pdf");
     console.log("PDF generated successfully!");
   } catch (error) {
     console.error("Error generating PDF:", error);
     alert("Failed to generate PDF. See console for details.");
   }
 };

  // Handle Export Menu
  const handleExportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="w-full p-4">
      {/* Action Buttons and Search */}
      <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex space-x-2">
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            onClick={() => alert("Add new item!")}
          >
            Add
          </button>
          <button
            className="flex items-center space-x-1 rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
            onClick={handleExportMenuOpen}
          >
            <Download />
            <span>Download</span>
          </button>
          {/* Export Menu */}
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleExportMenuClose}
          >
            <MenuItem
              onClick={() => {
                exportToCSV();
                handleExportMenuClose();
              }}
            >
              Export to CSV
            </MenuItem>
            <MenuItem
              onClick={() => {
                exportToExcel();
                handleExportMenuClose();
              }}
            >
              Export to Excel
            </MenuItem>
            <MenuItem
              onClick={() => {
                exportToPDF();
                handleExportMenuClose();
              }}
            >
              Export to PDF
            </MenuItem>
          </Menu>
        </div>

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 md:w-1/3"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* Data Table */}
      <DataGrid
        rows={filteredRows}
        columns={columns}
        paginationModel={{ pageSize: 5, page: 0 }}
        autoHeight
        checkboxSelection={false} // Disable row selection
        disableRowSelectionOnClick // Disable click-based selection
        sx={{
          "& .MuiDataGrid-root": { fontSize: "0.9rem" },
        }}
      />
    </div>
  );
};

export default ResponsiveDataTable;
