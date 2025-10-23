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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import {
  createEmployment,
  deleteEmployment,
  getEmployment_Id,
  getEmploymentById,
  updateEmployment,
} from "views/API/EmploymentApi";
import Swal from "sweetalert2";

const Employment = () => {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [employmentHistory, setEmploymentHistory] = useState([]);
  const [canAddNew, setCanAddNew] = useState(true);

  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    employmentType: "",
    currentctc: "",
    skill: "",
    jobDescription: "",
    noticePeriod: "",
  });

  const noticePeriodOptions = [
    "Immediate",
    "15 Days",
    "30 Days",
    "60 Days",
    "90 Days",
  ];

  const user = JSON.parse(sessionStorage.getItem("user"));
  const jobseekerProfileId = parseInt(
    sessionStorage.getItem("jobseekerProfileId")
  );
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  // Fetch employment data from API
  useEffect(() => {
    const fetchEmploymentData = async () => {
      const profileId = sessionStorage.getItem('jobseekerProfileId');

      try {
        const response = await getEmploymentById(headers,profileId);

        if (response.data) {
          const normalizedData = (
            Array.isArray(response.data) ? response.data : [response.data]
          ).map((job) => ({
            employmentId: job.employmentId,
            companyName: job.companyName,
            jobTitle: job.jobTitle,
            skill: job.skill,
            jobDescription: job.jobDescription || job.jobdiscription,
            noticePeriod: job.noticePeriod,
            currentctc: job.currentctc,
            employmentType: job.employmentType,
          }));
          setEmploymentHistory(normalizedData);
          setCanAddNew(normalizedData.length === 0);
        }
      } catch (error) {
        console.error("Error fetching employment data:", error);
        setEmploymentHistory([]);
        setCanAddNew(true);
      }
    };

    fetchEmploymentData();
  }, []);

  const handleOpen = async (index = null) => {
    if (index === null && !canAddNew) {
      Swal.fire({
        icon: "info",
        title: "Limit Reached",
        text: "You can only have one current employment record. Please edit or delete the existing record.",
      });
      return;
    }

    if (index !== null) {
      const employmentId = employmentHistory[index]?.employmentId;
      console.log("Editing Employment ID:", employmentId);

      try {
        const response = await getEmployment_Id(headers, employmentId);
        console.log("API Response:", response);

        if (response) {
          setFormData({
            jobTitle: response.jobTitle || "",
            companyName: response.companyName || "",
            employmentType: response.employmentType || "",
            currentctc: response.currentctc || "",
            skill: response.skill || "",
            jobDescription: response.jobDescription || response.jobdiscription || "",
            noticePeriod: response.noticePeriod || "",
            employmentId: response.employmentId || "",
          });
          setEditIndex(index);
        }
      } catch (error) {
        console.error("Error fetching employment data:", error);
      }
    } else {
      setFormData({
        jobTitle: "",
        companyName: "",
        employmentType: "",
        currentctc: "",
        skill: "",
        jobDescription: "",
        noticePeriod: "",
        employmentId: null,
      });
      setEditIndex(null);
    }

    setErrors({});
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (!formData.companyName.trim()) {
      setErrors({ ...errors, companyName: "Company Name is required" });
      return;
    }
    if (!formData.jobTitle.trim()) {
      setErrors({ ...errors, jobTitle: "Job Title is required" });
      return;
    }
    if (!formData.currentctc.trim()) {
      setErrors({ ...errors, currentctc: "Current CTC is required" });
      return;
    }
    if (!formData.skill.trim()) {
      setErrors({ ...errors, skill: "Skill is required" });
      return;
    }
    if (!formData.jobDescription.trim()) {
      setErrors({ ...errors, jobDescription: "Job Description is required" });
      return;
    }
    if (!formData.noticePeriod.trim()) {
      setErrors({ ...errors, noticePeriod: "Notice Period is required" });
      return;
    }
    if (!formData.employmentType.trim()) {
      setErrors({ ...errors, employmentType: "Employment Type is required" });
      return;
    }

    const jobSeekerId = parseInt(user?.seekerId);
    const jobseekerProfileId = parseInt(
      sessionStorage.getItem("jobseekerProfileId")
    );

    const employmentData = {
      employmentId: editIndex !== null ? employmentHistory[editIndex]?.employmentId : null,
      companyName: formData.companyName,
      jobTitle: formData.jobTitle,
      skill: formData.skill,
      jobDescription: formData.jobDescription,
      noticePeriod: formData.noticePeriod,
      currentctc: formData.currentctc,
      employmentType: formData.employmentType,
      createdDate: null,
      updatedDate: null,
      jobSeekerDtoList: { seekerId: jobSeekerId },
      jobSeekerProfileDtoList: { jobseekerProfileId: jobseekerProfileId },
    };

    try {
      if (editIndex !== null) {
        await updateEmployment(employmentData, headers);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Employment record updated successfully!",
        });
      } else {
        await createEmployment(employmentData, headers);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Employment record created successfully!",
        });
        setCanAddNew(false);
      }

      handleClose();

      const updatedResponse = await getEmploymentById(headers, jobseekerProfileId);
      if (updatedResponse.data) {
        const updatedData = (
          Array.isArray(updatedResponse.data)
            ? updatedResponse.data
            : [updatedResponse.data]
        ).map((job) => ({
          employmentId: job.employmentId,
          companyName: job.companyName,
          jobTitle: job.jobTitle,
          skill: job.skill,
          jobDescription: job.jobDescription || job.jobdiscription,
          noticePeriod: job.noticePeriod,
          currentctc: job.currentctc,
          employmentType: job.employmentType,
        }));
        setEmploymentHistory(updatedData);
      }
    } catch (error) {
      console.error("Error saving employment:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save employment record. Please try again.",
      });
    }
  };

  const handleDelete = async (index) => {
    const employmentId = employmentHistory[index].employmentId;

    try {
      const isDeleted = await deleteEmployment(employmentId, headers);
      if (isDeleted) {
        setEmploymentHistory(employmentHistory.filter((_, i) => i !== index));
        setCanAddNew(true);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Employment record has been deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting employment record:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete employment record. Please try again.",
      });
    }
  };

  return (
    <Box sx={{mt:-2}}>
      {employmentHistory.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No employment added yet
          </Typography>
          <Button
            onClick={() => handleOpen(null)}
            variant="outlined"
            startIcon={<Add />}
            disabled={!canAddNew}
          >
            Add Employment
          </Button>
        </Box>
      ) : (
        employmentHistory.map((job, index) => (
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
                  <span style={{ fontWeight: 600 }}>{job.companyName}</span>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <span style={{ color: '#666', fontWeight: 400 }}>Job Title:</span>{' '}
                  <span style={{ fontWeight: 600 }}>{job.jobTitle}</span>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <span style={{ color: '#666', fontWeight: 400 }}>Employment Type:</span>{' '}
                  <span style={{ fontWeight: 600 }}>{job.employmentType}</span>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <span style={{ color: '#666', fontWeight: 400 }}>Current CTC:</span>{' '}
                  <span style={{ fontWeight: 600 }}>₹{job.currentctc}</span>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <span style={{ color: '#666', fontWeight: 400 }}>Skill:</span>{' '}
                  <span style={{ fontWeight: 600 }}>{job.skill}</span>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <span style={{ color: '#666', fontWeight: 400 }}>Job Description:</span>{' '}
                  <span style={{ fontWeight: 600 }}>{job.jobDescription}</span>
                </Typography>
                <Typography variant="body2">
                  <span style={{ color: '#666', fontWeight: 400 }}>Notice Period:</span>{' '}
                  <span style={{ fontWeight: 600 }}>{job.noticePeriod}</span>
                </Typography>
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
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Box sx={{ textAlign: 'right', mt: 2 }}>
              <Tooltip 
                title={canAddNew ? "Add another employment record" : "You can only have one current employment record. Edit or delete the existing record to add a new one."}
                placement="top"
              >
                <span>
                  <Button
                    onClick={() => handleOpen(null)}
                    variant="text"
                    disabled={!canAddNew}
                    sx={{ 
                      color: canAddNew ? '#00bcd4' : '#ccc',
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
                        backgroundColor: canAddNew ? 'rgba(0,188,212,0.04)' : 'transparent' 
                      }
                    }}
                  >
                    Add More +
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>
        ))
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editIndex !== null ? "Edit Employment" : "Add Employment"}
        </DialogTitle>
        <DialogContent>
          {[
            { label: "Company Name", key: "companyName" },
            { label: "Job Title", key: "jobTitle" },
            { label: "Current CTC (₹)", key: "currentctc" },
            { label: "Skill", key: "skill" },
            { label: "Job Description", key: "jobDescription", multiline: true, rows: 3 },
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
            />
          ))}

          <FormControl fullWidth error={!!errors.employmentType} sx={{ mt: 2 }}>
            <InputLabel>Employment Type</InputLabel>
            <Select
              value={formData.employmentType}
              onChange={(e) => {
                setFormData({ ...formData, employmentType: e.target.value });
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  employmentType: "",
                }));
              }}
              label="Employment Type"
            >
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Temporary">Temporary</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Freelance">Freelance</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
              <MenuItem value="Gig-work">Gig-work</MenuItem>
            </Select>
            {errors.employmentType && (
              <Typography variant="caption" color="error">
                {errors.employmentType}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth error={!!errors.noticePeriod} sx={{ mt: 2 }}>
            <InputLabel>Notice Period</InputLabel>
            <Select
              value={formData.noticePeriod}
              onChange={(e) => {
                setFormData({ ...formData, noticePeriod: e.target.value });
                setErrors((prevErrors) => ({ ...prevErrors, noticePeriod: "" }));
              }}
              label="Notice Period"
            >
              {noticePeriodOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {errors.noticePeriod && (
              <Typography variant="caption" color="error">
                {errors.noticePeriod}
              </Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained">
            {editIndex !== null ? "Update" : "Add"}
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employment;