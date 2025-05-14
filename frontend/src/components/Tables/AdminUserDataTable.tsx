// components/DataTable.tsx
import React from "react";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { Alert, createTheme, ThemeProvider } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Spinner from "../Spinner";
import { useState } from "react";
import { deleteTeacher } from "@/service/teacher_service";
import {
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { Edit, Visibility, Delete, MoreVert } from "@mui/icons-material";
import AlertSuccess from "../Alerts/AlertSuccess";

// interface DataTableProps {
//   title: string;
//   data: (string | number | React.ReactNode)[][];
//   columns: string[];
//   options?: MUIDataTableOptions;
// }

const paginationModel = { page: 0, pageSize: 5 };
interface AdminUserDataTableProps {
  title: string;
  data: { id: string | number; [key: string]: any }[]; // Adjust type based on your data structure
  columns: { field: string; headerName: string; [key: string]: any }[]; // Adjust type based on your column structure
  options?: MUIDataTableOptions;
}

const AdminUserDataTable: React.FC<AdminUserDataTableProps> = ({
  title,
  data,
  columns,
  options,
}) => {
  //for checking user screen size
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const defaultOptions: MUIDataTableOptions = {
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 20, 30],
    responsive: "standard",
    tableBodyMaxHeight: "400px",
    print: true,
    ...options,
  };
  //handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  //handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const getMuiTheme = () =>
    createTheme({
      palette: {
        mode: "light",
      },
      components: {
        MuiTableCell: {
          styleOverrides: {
            head: {
              padding: "10px 4px",
            },
          },
        },
      },
    });
  //custom colums
  const customColumns = columns.map((column) => {
    return {
      ...column,
      headerClassName: "bg-gray-200",
      cellClassName: "text-sm",
      width: column.width || 150, // Default width if not specified

      renderHeader: () => <strong>{column.headerName}</strong>,
    };
  });
  //actions column
  const actions = {
    field: "actions",
    headerName: "Actions",
    headerClassName: "bg-gray-200",
    cellClassName: "text-sm",
    width: isSmallScreen ? 50 : 150,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderHeader: () => <strong>Actions</strong>,
    renderCell: (params: any) => (
      <div className="flex gap-2 dark:text-white">
        {/* Desktop View */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
          <IconButton
            aria-label="edit"
            onClick={() => handleEdit(params.row)}
            sx={{ color: theme.palette.success.main }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="view"
            onClick={() => handleView(params.row)}
            sx={{ color: theme.palette.info.main }}
          >
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(params.row)}
            sx={{ color: theme.palette.error.main }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>

        {/* Mobile View */}
        <IconButton
          aria-label="more-actions"
          onClick={handleMenuOpen}
          sx={{ display: { xs: "inline-flex", sm: "none" } }}
        >
          <MoreVert fontSize="small" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              handleEdit(params.row);
              handleMenuClose();
            }}
          >
            <Edit
              fontSize="small"
              sx={{ mr: 1, color: theme.palette.success.main }}
            />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleView(params.row);
              handleMenuClose();
            }}
          >
            <Visibility
              fontSize="small"
              sx={{ mr: 1, color: theme.palette.info.main }}
            />
            View
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleDelete(params.row);
              handleMenuClose();
            }}
          >
            <Delete
              fontSize="small"
              sx={{ mr: 1, color: theme.palette.error.main }}
            />
            Delete
          </MenuItem>
        </Menu>
      </div>
    ),
  };
  columns = [...customColumns, actions]; // Add actions column to the columns array
  //custom row sytle
  const getRowClassName = (params: any) => {
    return params.row.isActive ? "bg-gray-500" : "white";
  };
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        {...data}
        aria-label={title}
        getRowClassName={getRowClassName}
        rows={data}
        columns={columns}
        pageSizeOptions={[10, 20, 30]}
        initialState={{ pagination: { paginationModel } }}
        slots={{
          toolbar: GridToolbar,
          noRowsOverlay: () => (
            <div className="items-center justify-center text-center">
              No data available
            </div>
          ), // Custom no rows message
          loadingOverlay: () => (
            <div>
              <Spinner />
            </div>
          ), // Custom loading message
        }}
        sx={{
          border: 0,
          padding: "0px 4px",
          backgroundColor: "white",
          dark: { backgroundColor: "#1E1E2D" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F5F5F5",
            color: "#000",
          },
          "& .MuiDataGrid-row": {},
        }}
        getRowId={(row) => row.id} // Ensure each row has a unique ID
      />
    </div>
  );
};

export default AdminUserDataTable;

function handleEdit(row: any): void {
  alert(`Editing row with ID: ${row.id}`);
  // Implement your edit logic here
}

function handleDelete(row: any): void {
  try {
    // Perform delete operation here
    deleteTeacher(row.id).then(() => {
      <AlertSuccess title="Warning" message="Row deleted successfully" />;
    });
  } catch (error) {
    console.error("Error deleting row:", error);
  }
}
function handleView(row: any): void {
  alert(`Viewing row with ID: ${row.id}`);
  // Implement your view logic here
}
