import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  Collapse,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface TeacherFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dob: dayjs.Dayjs | null;
  sex: "MALE" | "FEMALE";
  address: string;
  qualifications: string[];
  subjects: string[];
}

interface AddTeacherModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: TeacherFormData) => Promise<void>;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<TeacherFormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: null,
    sex: "MALE",
    address: "",
    qualifications: [],
    subjects: [],
  });

  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    field: "qualifications" | "subjects",
    value: string,
  ) => {
    const currentValues = formData[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setFormData((prev) => ({ ...prev, [field]: newValues }));
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setFormData((prev) => ({ ...prev, dob: date }));
  };

  const handleSubmit = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.dob
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      setSuccess("Teacher added successfully!");
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          dob: null,
          sex: "MALE",
          address: "",
          qualifications: [],
          subjects: [],
        });
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to add teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Teacher</DialogTitle>
      <DialogContent>
        <Collapse in={!!error}>
          <Alert
            severity="error"
            action={
              <IconButton size="small" onClick={() => setError(null)}>
                <CloseIcon />
              </IconButton>
            }
          >
            {error}
          </Alert>
        </Collapse>
        <Collapse in={!!success}>
          <Alert
            severity="success"
            action={
              <IconButton size="small" onClick={() => setSuccess(null)}>
                <CloseIcon />
              </IconButton>
            }
          >
            {success}
          </Alert>
        </Collapse>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="First Name*"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Last Name*"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Username*"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email*"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth*"
              value={formData.dob}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
          <FormControl fullWidth>
            <InputLabel>Gender*</InputLabel>
            <Select
              name="sex"
              value={formData.sex}
              onChange={handleSelectChange}
            >
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Password*"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
          />  
          <TextField
            label="Confirm Password*"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
          />
          
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Qualifications"
            name="qualifications"
            value={formData.qualifications.join(", ")}
            onChange={(e) =>
              handleArrayChange("qualifications", e.target.value)
            }
            fullWidth
            select
          >
            <MenuItem value="Bachelors">Bachelors</MenuItem>
            <MenuItem value="Masters">Masters</MenuItem>
            <MenuItem value="PhD">PhD</MenuItem>
          </TextField>
          <TextField
            label="Subjects"
            name="subjects"
            value={formData.subjects.join(", ")}
            onChange={(e) => handleArrayChange("subjects", e.target.value)}
            fullWidth
            select
          >
            <MenuItem value="Math">Math</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="English">English</MenuItem>
          </TextField>
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />  

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTeacherModal;
