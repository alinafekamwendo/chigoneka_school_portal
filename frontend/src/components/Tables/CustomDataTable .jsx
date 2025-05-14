import React, { useState } from "react";
import {
  DataGrid,
  GridToolbar,
  GridActionsCellItem,
  GridRowModes,
  useGridApiRef,
} from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Edit,
  Visibility,
  Delete,
  MoreVert,
  ToggleOn,
  ToggleOff,
  Print as PrintIcon,
} from "@mui/icons-material";
import AlertSuccess from "../Alerts/AlertSuccess";

const initialColumns = [
  {
    field: "name",
    headerName: "Name",
    width: 150,
    sortable: false,
    filterable:false
  },
  { field: "company", headerName: "Company", width: 150 },
  { field: "city", headerName: "City", width: 150 },
  { field: "state", headerName: "State", width: 150 },
];

const CustomDataGrid = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);
  const [selectableRows, setSelectableRows] = useState(false);
  const apiRef = useGridApiRef();
  const systemTheme = useTheme();
  const isSmallScreen = useMediaQuery(systemTheme.breakpoints.down("sm"));
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const data = [
    {
      id: 1,
      name: "Joe James",
      company: "Test Corp",
      city: "Yonkers",
      state: "NY",
    },
    {
      id: 2,
      name: "Michael Kamwendo",
      company: "Test Corp",
      city: "Yonkers",
      state: "NY",
    },
    {
      id: 3,
      name: "Joe James",
      company: "Test Corp",
      city: "Yonkers",
      state: "NY",
    },
    {
      id: 4,
      name: "Yamikani Mapalamba",
      company: "Test Corp",
      city: "Yonkers",
      state: "NY",
    },
    {
      id: 5,
      name: "James Phiri",
      company: "Test Corp",
      city: "Yonkers",
      state: "NY",
    },
    {
      id: 6,
      name: "James Phiri",
      company: "Test Corp",
      city: "Yonkers",
      state: "NY",
    },
    {
      id: 7,
      name: "James Phiri",
      company: "Test Corp",
      city: "Yonkers",
      state: "NY",
    },
    {
      id: 8,
      name: "James Phiri",
      company: "Test Corp",
      city: "Yonkers",
      state: "NY",
    },
    {
      id: 9,
      name: "James Phiri",
      company: "Test Corp",
      city: "Yonkers",
      state: "NY",
    },
    {
      id: 10,
      name: "James Phiri",
      company: "Test Corp",
      city: "Yonkers",
      state: "NY",
    },
    {
      id: 11,
      name: "James Phiri",
      company: "Test Corp",
      city: "Yonkers",
      state: "NY",
    },
    {
      id: 12,
      name: "James Phiri",
      company: "Test Corp",
      city: "Yonkers",
      state: "NY",
    },
    {
      id: 13,
      name: "James Phiri",
      company: "Test Corp",
      city: "Yonkers",
      state: "NY",
    },
    {
      id: 14,
      name: "James Phiri",
      company: "Test Corp",
      city: "Yonkers",
      state: "NY",
    },
  ];

  const handleEdit = (id) => {
    alert(`Editing row with ID: ${id}`);
  };

  const handleDelete = async (id) => {
    try {
      // await deleteTeacher(id);
      <AlertSuccess title="Success" message="Row deleted successfully" />;
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const handleView = (id) => {
    alert(`Viewing row with ID: ${id}`);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const toggleSelectableRows = () => {
    setSelectableRows((prev) => !prev);
    if (!selectableRows) {
      setSelectionModel([]);
    }
  };

  const handlePrint = () => {
    apiRef.current.exportDataAsPrint();
  };

  const actionsColumn = {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    width: isSmallScreen ? 50 : 150,
    getActions: (params) =>
      [
        !isSmallScreen && (
          <GridActionsCellItem
            icon={
              <Tooltip title="Edit">
                <Edit fontSize="small" color="success" />
              </Tooltip>
            }
            label="Edit"
            onClick={() => handleEdit(params.id)}
            showInMenu={false}
          />
        ),
        !isSmallScreen && (
          <GridActionsCellItem
            icon={
              <Tooltip title="View">
                <Visibility fontSize="small" color="info" />
              </Tooltip>
            }
            label="View"
            onClick={() => handleView(params.id)}
            showInMenu={false}
          />
        ),
        !isSmallScreen && (
          <GridActionsCellItem
            icon={
              <Tooltip title="Delete">
                <Delete fontSize="small" color="error" />
              </Tooltip>
            }
            label="Delete"
            onClick={() => handleDelete(params.id)}
            showInMenu={false}
          />
        ),
        isSmallScreen && (
          <GridActionsCellItem
            icon={
              <Tooltip title="More actions">
                <MoreVert fontSize="small" />
              </Tooltip>
            }
            label="More"
            onClick={(e) => handleMenuOpen(e, params.row)}
            showInMenu={false}
          />
        ),
      ].filter(Boolean),
  };

  const columns = [...initialColumns, actionsColumn];

  const getMuiTheme = () =>
    createTheme({
      palette: {
        mode: prefersDarkMode ? "dark" : "light",
      },
      components: {
        MuiDataGrid: {
          styleOverrides: {
            sx: {
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: prefersDarkMode ? "#374151" : "#f3f4f6",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${prefersDarkMode ? "#374151" : "#e5e7eb"}`,
                color: `1px solid ${prefersDarkMode ? "#374151" : "#e5e7eb"}`,
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
              },
            },
          },
        },
      },
    });

  const CustomToolbar = () => (
    <Box sx={{ display: "flex", p: 1 }}>
      <Tooltip title={`Toggle selection (${selectableRows ? "on" : "off"})`}>
        <IconButton onClick={toggleSelectableRows}>
          {selectableRows ? <ToggleOn /> : <ToggleOff />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Print">
        <IconButton onClick={handlePrint}>
          <PrintIcon />
        </IconButton>
      </Tooltip>
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbar />
    </Box>
  );

  return (
    <div className="dark:bg-gray-900 " style={{ height: 600, width: "100%" }}>
      <ThemeProvider className="bg-red" theme={getMuiTheme()}>
        <DataGrid
          
          apiRef={apiRef}
          rows={data}
          columns={columns}
          checkboxSelection={selectableRows}
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          rowSelectionModel={selectionModel}
          slots={{
            toolbar: CustomToolbar,
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 20, 30]}
        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              handleEdit(selectedRow?.id);
              handleMenuClose();
            }}
          >
            <Edit
              fontSize="small"
              sx={{ mr: 1, color: systemTheme.palette.success.main }}
            />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleView(selectedRow?.id);
              handleMenuClose();
            }}
          >
            <Visibility
              fontSize="small"
              sx={{ mr: 1, color: systemTheme.palette.info.main }}
            />
            View
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleDelete(selectedRow?.id);
              handleMenuClose();
            }}
          >
            <Delete
              fontSize="small"
              sx={{ mr: 1, color: systemTheme.palette.error.main }}
            />
            Delete
          </MenuItem>
        </Menu>
      </ThemeProvider>
    </div>
  );
};

export default CustomDataGrid;
