import React, { useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  TextField,
  Box,
  Button,
  Switch,
  Typography,
  CssBaseline,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const CustomToolbar = ({ onSearchChange, onRefresh }) => {
  return (
    <GridToolbarContainer
      sx={{
        display: "flex",
        gap: 2,
        p: 1,
        backgroundColor: "#f4f4f4",
        borderRadius: 1,
      }}
    >
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search..."
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flexGrow: 1 }}
      />
      <GridToolbarFilterButton />
      <GridToolbarExport />
      <Button
        variant="contained"
        color="primary"
        startIcon={<RefreshIcon />}
        onClick={onRefresh}
      >
        Refresh
      </Button>
    </GridToolbarContainer>
  );
};

const MuiDataTable = ({ rows, columns }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState(rows);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const handleRefresh = () => {
    setData([...rows]); // Reset to original data
  };

  const filteredRows = data.filter((row) =>
    columns.some((col) =>
      row[col.field]?.toString().toLowerCase().includes(search.toLowerCase()),
    ),
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box p={2} sx={{ width: "100%", height: 500 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h6">Data Table</Typography>
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </Box>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          autoHeight
          components={{
            Toolbar: () => (
              <CustomToolbar
                onSearchChange={setSearch}
                onRefresh={handleRefresh}
              />
            ),
          }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default MuiDataTable;
