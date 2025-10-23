import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { createEducation, deleteEducation, getAllEducation, getEducationById, updateEducation } from "views/API/EducationApi";

const EducationDetails = () => {
  const [education, setEducation] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEducation, setNewEducation] = useState({
    educationName: "",
    institutionName: "",
    percentage: "",
    yearOfPassing: "",
    description: "",
    startDate: null, // Ensure it's null initially
    endDate: null,   // Ensure it's null initially
  });

  const [errors, setErrors] = useState({});


  //! headers and access tokens
  const user = JSON.parse(sessionStorage.getItem("user"));
  const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");

  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user?.accessToken,
  };


  //todo:useeffect
  useEffect(() => {
    const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");
    if (jobseekerProfileId) {
      fetchEducationData();
    } else {
      console.error("Jobseeker Profile ID is not available");
    }
  }, []);



  //! fetch the education data 
  const fetchEducationData = async () => {
    // Retrieve jobseekerProfileId dynamically from session storage
    const jobseekerProfileId = sessionStorage.getItem('jobseekerProfileId');

    if (!jobseekerProfileId) {
      console.error("Jobseeker Profile ID not found in session storage.");
      return;
    }

    try {
      const response = await getEducationById(jobseekerProfileId, headers);
      if (response && Array.isArray(response.data)) {
        const formattedData = response.data.map((edu) => ({
          educationId: edu.educationId,
          educationName: edu.educationName || "",
          institutionName: edu.instituteName || "",
          description: edu.description || "", // Ensure this is correctly mapped
          percentage: String(edu.percentage || ""),
          startDate: edu.fromDate ? dayjs(edu.fromDate).isValid() ? dayjs(edu.fromDate) : null : null,
          endDate: edu.toDate ? dayjs(edu.toDate).isValid() ? dayjs(edu.toDate) : null : null,
        }));
        setEducation(formattedData);
      }
    } catch (error) {
      console.error("Error fetching education details:", error);
    }
  };


  const validateFields = () => {
    let tempErrors = {};
    let isValid = true;

    if (!newEducation.educationName?.trim()) {
      tempErrors.educationName = "Education Name is required";
      isValid = false;
    }
    if (!newEducation.institutionName?.trim()) {
      tempErrors.institutionName = "Institution Name is required";
      isValid = false;
    }

    if (!newEducation.percentage?.trim()) {
      tempErrors.percentage = "Percentage is required";
      isValid = false;
    } else if (
      isNaN(newEducation.percentage) ||
      parseFloat(newEducation.percentage) < 0 ||
      parseFloat(newEducation.percentage) > 100
    ) {
      tempErrors.percentage = "Percentage must be between 0 and 100";
      isValid = false;
    }

    if (!newEducation.startDate) {
      tempErrors.startDate = "Start Date is required";
      isValid = false;
    }

    if (!newEducation.endDate) {
      tempErrors.endDate = "End Date is required";
      isValid = false;
    } else if (dayjs(newEducation.endDate).isBefore(dayjs(newEducation.startDate))) {
      tempErrors.endDate = "End Date cannot be before Start Date";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };


  const handleChange = (e, field) => {
    const value = e.target.value;
    setNewEducation((prev) => ({
      ...prev,
      [field]: field === "percentage" ? String(value) : value, // Ensure percentage is a string
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDateChange = (value, field) => {
    setNewEducation((prev) => ({
      ...prev,
      [field]: value, // Store as Day.js object
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };



  //Todo:data get by id
  const handleOpenDialog = async (index = null) => {
    if (index !== null) {
      const selectedEducation = education[index];

      try {
        const updatedData = await getAllEducation(selectedEducation.educationId, headers);
        if (updatedData) {
          setNewEducation({
            educationName: updatedData.educationName || "",
            institutionName: updatedData.instituteName || "",
            percentage: String(updatedData.percentage || ""),
            description: updatedData.description || "", // Ensure this is included
            startDate: updatedData.fromDate ? dayjs(updatedData.fromDate) : null,
            endDate: updatedData.toDate ? dayjs(updatedData.toDate) : null,
          });
        }
      } catch (error) {
        console.error("Error fetching education details:", error);
      }
      setOpenDialog(false);
      setEditingIndex(index);
    } else {
      setNewEducation({
        educationName: "",
        institutionName: "",
        percentage: "",
        yearOfPassing: "",
        description: "",
        startDate: null,
        endDate: null,
      });
      setEditingIndex(null);
    }

    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIndex(null);
    setErrors({});
  };

  //todo:post method and update method
  const handleSaveEducation = async () => {
    if (!validateFields()) {
      return;
    }

    const user = JSON.parse(sessionStorage.getItem("user"));
    const jobSeekerId = user?.seekerId;
    const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");

    if (!jobSeekerId || !jobseekerProfileId) {
      await Swal.fire({
        target: document.getElementById("your-dialog-id"),
        icon: "error",
        title: "Missing Data",
        text: "User  details are missing. Please log in again.",
        confirmButtonText: "OK",
      });
      return;
    }

    const educationData = {
      educationId: editingIndex !== null ? education[editingIndex].educationId : undefined,
      educationName: newEducation.educationName,
      fromDate: newEducation.startDate ? newEducation.startDate.toISOString() : "",
      toDate: newEducation.endDate ? newEducation.endDate.toISOString() : "",
      instituteName: newEducation.institutionName,
      percentage: newEducation.percentage ? parseFloat(newEducation.percentage) : 0,
      description: newEducation.description || "", // Add this line
      jobSeekerDtoList: { seekerId: jobSeekerId },
      jobSeekerProfileDtoList: { jobseekerProfileId: jobseekerProfileId },
    };

    try {
      if (editingIndex !== null) {
        await updateEducation(educationData, headers);
      } else {
        await createEducation(educationData, headers);
      }

      // Fetch the updated data
      await fetchEducationData();



      // Close the dialog
      setOpenDialog(false);
      setEditingIndex(null);

      // Reset form fields
      setNewEducation({
        educationName: "",
        institutionName: "",
        percentage: "",
        description: "",
        startDate: null,
        endDate: null,
      });

    } catch (error) {
      console.error("Error saving education:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save education details",
        confirmButtonText: "OK",
      });
    }
  };




  //! delete api 
  const handleRemoveEducation = async (index, educationId) => {
    try {
      const isDeleted = await deleteEducation(educationId, headers);

      if (isDeleted) {
        setEducation((prev) => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{mt:-2}}>
        {education.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No education added yet
            </Typography>
            <Button
              onClick={() => handleOpenDialog()}
              variant="outlined"
              startIcon={<Add />}
            >
              Add Education
            </Button>
          </Box>
        ) : (
          education.map((edu, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: 'white',
                position: 'relative',
              }}
            >
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <span style={{ color: '#666', fontWeight: 400 }}>Education Name:</span>{' '}
                    <span style={{ fontWeight: 600 }}>{edu.educationName}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <span style={{ color: '#666', fontWeight: 400 }}>Institution:</span>{' '}
                    <span style={{ fontWeight: 600 }}>{edu.institutionName}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <span style={{ color: '#666', fontWeight: 400 }}>Percentage:</span>{' '}
                    <span style={{ fontWeight: 600 }}>{edu.percentage}%</span>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <span style={{ color: '#666', fontWeight: 400 }}>Start Date:</span>{' '}
                    <span style={{ fontWeight: 600 }}>{edu.startDate ? edu.startDate.format("DD-MM-YYYY") : "N/A"}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <span style={{ color: '#666', fontWeight: 400 }}>End Date:</span>{' '}
                    <span style={{ fontWeight: 600 }}>{edu.endDate ? edu.endDate.format("DD-MM-YYYY") : "N/A"}</span>
                  </Typography>
                  {edu.description && (
                    <Typography variant="body2">
                      <span style={{ color: '#666', fontWeight: 400 }}>Description:</span>{' '}
                      <span style={{ fontWeight: 600 }}>{edu.description}</span>
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: "flex", gap: 1, position: 'absolute', top: 16, right: 16 }}>
                  <Tooltip title="Edit record">
                    <IconButton 
                      onClick={() => handleOpenDialog(index)} 
                      size="small"
                      sx={{ 
                        color: '#333',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete record">
                    <IconButton
                      onClick={() => handleRemoveEducation(index, edu.educationId)}
                      size="small"
                      sx={{ 
                        color: '#d32f2f',
                        '&:hover': { backgroundColor: 'rgba(211,47,47,0.04)' }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          ))
        )}

        {education.length > 0 && (
          <Box sx={{ textAlign: 'right', mt: 2 }}>
            <Tooltip title="Add another education record">
              <span>
                <Button
                  onClick={() => handleOpenDialog()}
                  variant="text"
                  sx={{ 
                    color: '#00bcd4',
                    textTransform: 'none',
                    fontFamily: 'Poppins',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    fontSize: '16px',
                    lineHeight: '20px',
                    letterSpacing: '0.35px',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    '&:hover': { 
                      backgroundColor: 'rgba(0,188,212,0.04)' 
                    }
                  }}
                >
                  Add More +
                </Button>
              </span>
            </Tooltip>
          </Box>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth id="your-dialog-id">
          <DialogTitle>{editingIndex !== null ? "Edit Education" : "Add Education"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField fullWidth label="Education Name" value={newEducation.educationName} onChange={(e) => handleChange(e, "educationName")} error={!!errors.educationName} helperText={errors.educationName} sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#0095a5" }, // Default border color
                    "&:hover fieldset": { borderColor: "#0095a5" }, // Hover effect
                    "&.Mui-focused fieldset": { borderColor: "#0095a5" }, // Focused effect
                  },
                  "& .MuiInputLabel-root": {
                    color: "#0095a5", // Label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#0095a5", // Focused label color
                  },
                }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Institution Name" value={newEducation.institutionName} onChange={(e) => handleChange(e, "institutionName")} error={!!errors.institutionName} helperText={errors.institutionName} sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#0095a5" }, // Default border color
                    "&:hover fieldset": { borderColor: "#0095a5" }, // Hover effect
                    "&.Mui-focused fieldset": { borderColor: "#0095a5" }, // Focused effect
                  },
                  "& .MuiInputLabel-root": {
                    color: "#0095a5", // Label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#0095a5", // Focused label color
                  },
                }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Percentage " value={newEducation.percentage} onChange={(e) => handleChange(e, "percentage")} error={!!errors.percentage} helperText={errors.percentage} sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#0095a5" }, // Default border color
                    "&:hover fieldset": { borderColor: "#0095a5" }, // Hover effect
                    "&.Mui-focused fieldset": { borderColor: "#0095a5" }, // Focused effect
                  },
                  "& .MuiInputLabel-root": {
                    color: "#0095a5", // Label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#0095a5", // Focused label color
                  },
                }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="description " value={newEducation.description} onChange={(e) => handleChange(e, "description")} sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#0095a5" }, // Default border color
                    "&:hover fieldset": { borderColor: "#0095a5" }, // Hover effect
                    "&.Mui-focused fieldset": { borderColor: "#0095a5" }, // Focused effect
                  },
                  "& .MuiInputLabel-root": {
                    color: "#0095a5", // Label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#0095a5", // Focused label color
                  },
                }} />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="Start Date"
                  value={newEducation.startDate} // Use Day.js object directly
                  onChange={(value) => handleDateChange(value, "startDate")}
                  renderInput={(params) => (
                    <TextField {...params} error={!!errors.startDate} helperText={errors.startDate} />
                  )}
                />
                {errors.startDate && <Typography color="error">{errors.startDate}</Typography>}
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="End Date"
                  value={newEducation.endDate} // Use Day.js object directly
                  onChange={(value) => handleDateChange(value, "endDate")}
                  renderInput={(params) => (
                    <TextField {...params} error={!!errors.endDate} helperText={errors.endDate} />
                  )}
                />
                {errors.endDate && <Typography color="error">{errors.endDate}</Typography>}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveEducation} variant="contained"> {editingIndex !== null ? "Save" : "Add"}</Button>
            <Button onClick={handleCloseDialog} sx={{ color: "#0095a5" }}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default EducationDetails;