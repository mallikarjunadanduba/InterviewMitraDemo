import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { createExperience, deleteExperience, getAllExperiences, getExperienceById, updateExperience } from "views/API/ExperienceApi";
import Swal from 'sweetalert2';

const ExperienceDetails = () => {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    experienceId: null,
    companyName: "",
    designation: "",
    startDate: null,
    endDate: null,
    experienceYears: "",
    description: "",
  });

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };

  // Fetch experience data from API
  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      setApiError("");
      
      try {
        const profileId = sessionStorage.getItem('jobseekerProfileId');
        
        if (!profileId) {
          setApiError("Profile ID not found. Please login again.");
          setLoading(false);
          return;
        }

        const response = await getAllExperiences(profileId, headers);

        if (response && response.data && Array.isArray(response.data)) {
          const formattedExperiences = response.data.map((exp) => ({
            experienceId: exp.experienceId,
            companyName: exp.companyName,
            designation: exp.designation,
            startDate: dayjs(exp.fromDate),
            endDate: dayjs(exp.toDate),
            experienceYears: exp.experienceYears || calculateYearsOfExperience(exp.fromDate, exp.toDate).toFixed(2),
            description: exp.description || "",
          }));

          setExperience(formattedExperiences);
        } else {
          setExperience([]);
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
        setApiError("Failed to fetch experience data. Please try again.");
        setExperience([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const calculateYearsOfExperience = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const diffInMonths = end.diff(start, "month");
    return diffInMonths / 12;
  };

  const handleOpen = async (index = null) => {
    if (index !== null) {
      const experienceId = experience[index]?.experienceId;
      console.log("Editing Experience ID:", experienceId);

      try {
        setLoading(true);
        const response = await getExperienceById(headers, experienceId);
        console.log("API Response:", response);

        if (response && response.data) {
          const expData = response.data;
          setFormData({
            experienceId: expData.experienceId || null,
            companyName: expData.companyName || "",
            designation: expData.designation || "",
            startDate: expData.fromDate ? dayjs(expData.fromDate) : null,
            endDate: expData.toDate ? dayjs(expData.toDate) : null,
            experienceYears: expData.experienceYears || "",
            description: expData.description || "",
          });
          setEditIndex(index);
        }
      } catch (error) {
        console.error("Error fetching experience data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch experience data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setFormData({
        experienceId: null,
        companyName: "",
        designation: "",
        startDate: null,
        endDate: null,
        experienceYears: "",
        description: "",
      });
      setEditIndex(null);
    }

    setErrors({});
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    // Validation
    const newErrors = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company Name is required";
    }
    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start Date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End Date is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check if end date is after start date
    if (formData.endDate.isBefore(formData.startDate)) {
      setErrors({ ...errors, endDate: "End Date must be after Start Date" });
      return;
    }

    setLoading(true);

    try {
      const jobSeekerId = parseInt(user?.seekerId);
      const jobseekerProfileId = parseInt(sessionStorage.getItem("jobseekerProfileId"));

      if (!jobSeekerId || !jobseekerProfileId) {
        throw new Error("User profile information not found");
      }

      // Ensure we have valid IDs
      if (isNaN(jobSeekerId) || isNaN(jobseekerProfileId)) {
        throw new Error("Invalid user profile information");
      }

      // Calculate experience years
      const experienceYears = calculateYearsOfExperience(formData.startDate, formData.endDate);

      const experienceData = {
        companyName: formData.companyName.trim(),
        designation: formData.designation.trim(),
        description: formData.description.trim(),
        experienceYears: experienceYears,
        fromDate: formData.startDate ? formData.startDate.format("YYYY-MM-DD") : "",
        toDate: formData.endDate ? formData.endDate.format("YYYY-MM-DD") : "",
        jobSeekerDtoList: {
          seekerId: jobSeekerId
        },
        jobSeekerProfileDtoList: {
          seekerId: jobSeekerId,
          profileId: jobseekerProfileId
        }
      };

      // If editing, include the experienceId
      if (editIndex !== null && formData.experienceId) {
        experienceData.experienceId = formData.experienceId;
      }

      // Log the data being sent to API for verification
      console.log("Data being sent to API:", JSON.stringify(experienceData, null, 2));

      if (editIndex !== null) {
        // Update existing experience
        await updateExperience(experienceData, headers);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Experience record updated successfully!",
        });
      } else {
        // Create new experience
        await createExperience(experienceData, headers);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Experience record created successfully!",
        });
      }

      handleClose();

      // Refresh the experience list
      const updatedResponse = await getAllExperiences(jobseekerProfileId, headers);
      if (updatedResponse && updatedResponse.data && Array.isArray(updatedResponse.data)) {
        const updatedData = updatedResponse.data.map((exp) => ({
          experienceId: exp.experienceId,
          companyName: exp.companyName,
          designation: exp.designation,
          startDate: dayjs(exp.fromDate),
          endDate: dayjs(exp.toDate),
          experienceYears: exp.experienceYears || calculateYearsOfExperience(exp.fromDate, exp.toDate).toFixed(2),
          description: exp.description || "",
        }));
        setExperience(updatedData);
      }
    } catch (error) {
      console.error("Error saving experience:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save experience record. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    const experienceId = experience[index].experienceId;

    try {
      setLoading(true);
      const isDeleted = await deleteExperience(experienceId, headers);
      
      if (isDeleted) {
        setExperience(experience.filter((_, i) => i !== index));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Experience record has been deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting experience record:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete experience record. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && experience.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{mt:-2}}>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError("")}>
            {apiError}
          </Alert>
        )}

        {experience.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No experience added yet
            </Typography>
            <Button
              onClick={() => handleOpen(null)}
              variant="outlined"
              startIcon={<Add />}
              disabled={loading}
            >
              Add Experience
            </Button>
          </Box>
        ) : (
          experience.map((exp, index) => (
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
                    <span style={{ color: '#666', fontWeight: 400 }}>Company Name:</span>{' '}
                    <span style={{ fontWeight: 600 }}>{exp.companyName}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <span style={{ color: '#666', fontWeight: 400 }}>Designation:</span>{' '}
                    <span style={{ fontWeight: 600 }}>{exp.designation}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <span style={{ color: '#666', fontWeight: 400 }}>Start Date:</span>{' '}
                    <span style={{ fontWeight: 600 }}>{exp.startDate.format("DD-MM-YYYY")}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <span style={{ color: '#666', fontWeight: 400 }}>End Date:</span>{' '}
                    <span style={{ fontWeight: 600 }}>{exp.endDate.format("DD-MM-YYYY")}</span>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <span style={{ color: '#666', fontWeight: 400 }}>Experience:</span>{' '}
                    <span style={{ fontWeight: 600 }}>{exp.experienceYears} years</span>
                  </Typography>
                  {exp.description && (
                    <Typography variant="body2">
                      <span style={{ color: '#666', fontWeight: 400 }}>Description:</span>{' '}
                      <span style={{ fontWeight: 600 }}>{exp.description}</span>
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: "flex", gap: 1, position: 'absolute', top: 16, right: 16 }}>
                  <Tooltip title="Edit record">
                    <IconButton 
                      onClick={() => handleOpen(index)} 
                      size="small"
                      sx={{ 
                        color: '#333',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                      }}
                      disabled={loading}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete record">
                    <IconButton
                      onClick={() => handleDelete(index)}
                      size="small"
                      sx={{ 
                        color: '#d32f2f',
                        '&:hover': { backgroundColor: 'rgba(211,47,47,0.04)' }
                      }}
                      disabled={loading}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          ))
        )}

        {experience.length > 0 && (
          <Box sx={{ textAlign: 'right', mt: 2 }}>
            <Tooltip title="Add another experience record">
              <span>
                <Button
                  onClick={() => handleOpen(null)}
                  variant="text"
                  disabled={loading}
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

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editIndex !== null ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
          <DialogContent>
            {editIndex !== null && formData.experienceId && (
              <TextField
                label="Experience ID"
                value={formData.experienceId}
                fullWidth
                disabled
                sx={{ mt: 2 }}
              />
            )}
            {[
              { label: "Company Name", key: "companyName" },
              { label: "Designation", key: "designation" },
              { label: "Description", key: "description", multiline: true, rows: 3 },
            ].map(({ label, key, multiline = false, rows = 1 }) => (
              <TextField
                key={key}
                label={label}
                fullWidth
                multiline={multiline}
                rows={rows}
                value={formData[key]}
                onChange={(e) => {
                  setFormData({ ...formData, [key]: e.target.value });
                  setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
                }}
                error={!!errors[key]}
                helperText={errors[key]}
                required
                sx={{ mt: 2 }}
                disabled={loading}
              />
            ))}

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(value) => {
                  setFormData({ ...formData, startDate: value });
                  setErrors((prevErrors) => ({ ...prevErrors, startDate: "" }));
                }}
                disabled={loading}
                slotProps={{
                  textField: { 
                    fullWidth: true,
                    error: !!errors.startDate, 
                    helperText: errors.startDate 
                  },
                }}
              />
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(value) => {
                  setFormData({ ...formData, endDate: value });
                  setErrors((prevErrors) => ({ ...prevErrors, endDate: "" }));
                }}
                disabled={loading}
                slotProps={{
                  textField: { 
                    fullWidth: true,
                    error: !!errors.endDate, 
                    helperText: errors.endDate 
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleSave} 
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Saving..." : (editIndex !== null ? "Update" : "Add")}
            </Button>
            <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ExperienceDetails;
