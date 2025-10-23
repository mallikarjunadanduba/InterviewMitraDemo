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
import { createSocialmedia, deleteSocialMedia, getSocialmediaById, getSocialmediaDetails, updatesocialmedia } from "views/API/SocialMediaApi";
import Swal from 'sweetalert2';

const ContactInfo = () => {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [contactLinks, setContactLinks] = useState([]);

  const [formData, setFormData] = useState({
    socialmediaName: "",
    socialmediaLink: "",
  });

  const platforms = [
    "LinkedIn",
    "GitHub",
    "Twitter",
    "Facebook",
    "Instagram",
    "YouTube",
    "Website",
    "Portfolio",
    "Other"
  ];

  const user = JSON.parse(sessionStorage.getItem("user"));
  const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user?.accessToken,
  };

  // Fetch contact links when component mounts
  useEffect(() => {
    const fetchContactLinks = async () => {
      try {
        const profileId = sessionStorage.getItem('jobseekerProfileId');
        const response = await getSocialmediaById(headers, profileId);

        if (response?.data) {
          const formattedLinks = response.data.map((link) => {
            return {
              socialMediaId: link.socialMediaId || link.id || link.socialmediaId,
              socialmediaName: link.socialmediaName || link.socialMediaName || "",
              socialmediaLink: link.socialmediaLink || link.socialMediaLink || "",
            };
          });
          setContactLinks(formattedLinks);
        }
      } catch (error) {
        console.error("Error fetching contact links:", error);
        setContactLinks([]);
      }
    };

    fetchContactLinks();
  }, []);

  const handleOpen = async (index = null) => {
    if (index !== null) {
      const socialMediaId = contactLinks[index]?.socialMediaId;
      console.log("Editing Contact Link ID:", socialMediaId);

      try {
        const response = await getSocialmediaDetails(socialMediaId, headers);
        console.log("API Response:", response);

        if (response) {
          setFormData({
            socialmediaName: response.socialmediaName || "",
            socialmediaLink: response.socialmediaLink || "",
            socialMediaId: response.socialMediaId || "",
          });
          setEditIndex(index);
        }
      } catch (error) {
        console.error("Error fetching contact link data:", error);
      }
    } else {
      setFormData({
        socialmediaName: "",
        socialmediaLink: "",
        socialMediaId: null,
      });
      setEditIndex(null);
    }

    setErrors({});
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (!formData.socialmediaName.trim()) {
      setErrors({ ...errors, socialmediaName: "Platform is required" });
      return;
    }
    if (!formData.socialmediaLink.trim()) {
      setErrors({ ...errors, socialmediaLink: "URL is required" });
      return;
    }

    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(formData.socialmediaLink.trim())) {
      setErrors({ ...errors, socialmediaLink: "Please enter a valid URL starting with http:// or https://" });
      return;
    }

    const jobSeekerId = parseInt(user?.seekerId);
    const jobseekerProfileId = parseInt(sessionStorage.getItem("jobseekerProfileId"));

    const contactData = {
      socialMediaId: editIndex !== null ? contactLinks[editIndex]?.socialMediaId : null,
      socialmediaName: formData.socialmediaName,
      socialmediaLink: formData.socialmediaLink.trim(),
      jobSeekerDtoList: { 
        seekerId: jobSeekerId,
        mailId: user?.mailId || "",
        mobileNumber: user?.mobileNumber || "",
        userName: user?.userName || ""
      },
      jobSeekerProfileDtoList: { 
        jobseekerProfileId: jobseekerProfileId,
        jobseekerProfileName: user?.jobseekerProfileName || ""
      },
    };

    try {
      if (editIndex !== null) {
        await updatesocialmedia(contactData, headers);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Contact link updated successfully!",
        });
      } else {
        await createSocialmedia(contactData, headers);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Contact link added successfully!",
        });
      }

      handleClose();

      // Refresh contact links list
      const updatedResponse = await getSocialmediaById(headers, jobseekerProfileId);
      if (updatedResponse?.data) {
        const updatedData = updatedResponse.data.map((link) => ({
          socialMediaId: link.socialMediaId || link.id || link.socialmediaId,
          socialmediaName: link.socialmediaName || link.socialMediaName || "",
          socialmediaLink: link.socialmediaLink || link.socialMediaLink || "",
        }));
        setContactLinks(updatedData);
      }
    } catch (error) {
      console.error("Error saving contact link:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save contact link. Please try again.",
      });
    }
  };

  const handleDelete = async (index) => {
    console.log("Deleting contact link at index:", index);
    console.log("Contact links array:", contactLinks);
    console.log("Contact link to delete:", contactLinks[index]);
    
    const socialMediaId = contactLinks[index]?.socialMediaId;
    console.log("socialMediaId:", socialMediaId);
    
    if (!socialMediaId) {
      console.error("socialMediaId is undefined for index:", index);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Cannot delete: Invalid record ID",
      });
      return;
    }

    try {
      const isDeleted = await deleteSocialMedia(socialMediaId, headers);
      if (isDeleted) {
        setContactLinks(contactLinks.filter((_, i) => i !== index));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Contact link has been deleted.",
        });
      }
    } catch (error) {
      console.error("Error deleting contact link:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete contact link. Please try again.",
      });
    }
  };

  return (
    <Box sx={{mt:-2}}>
      {contactLinks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No contact links added yet
          </Typography>
          <Button
            onClick={() => handleOpen()}
            variant="outlined"
            startIcon={<Add />}
          >
            Add Contact Link
          </Button>
        </Box>
      ) : (
        contactLinks.map((link, index) => (
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
                  <span style={{ color: '#666', fontWeight: 400 }}>Platform:</span>{' '}
                  <span style={{ fontWeight: 600 }}>{link.socialmediaName}</span>
                </Typography>
                <Typography variant="body2">
                  <span style={{ color: '#666', fontWeight: 400 }}>URL:</span>{' '}
                  <a 
                    href={link.socialmediaLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      fontWeight: 600, 
                      color: '#00bcd4', 
                      textDecoration: 'none' 
                    }}
                  >
                    {link.socialmediaLink}
                  </a>
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
          </Box>
        ))
      )}

      {contactLinks.length > 0 && (
        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Tooltip title="Add another contact link">
            <span>
              <Button
                onClick={() => handleOpen()}
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

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editIndex !== null ? "Edit Contact Link" : "Add Contact Link"}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Platform</InputLabel>
            <Select
              value={formData.socialmediaName}
              label="Platform"
              onChange={(e) => {
                setFormData({ ...formData, socialmediaName: e.target.value });
                setErrors((prevErrors) => ({ ...prevErrors, socialmediaName: "" }));
              }}
              error={!!errors.socialmediaName}
            >
              {platforms.map((platform) => (
                <MenuItem key={platform} value={platform}>
                  {platform}
                </MenuItem>
              ))}
            </Select>
            {errors.socialmediaName && (
              <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                {errors.socialmediaName}
              </Typography>
            )}
          </FormControl>

          <TextField
            label="URL"
            fullWidth
            value={formData.socialmediaLink}
            onChange={(e) => {
              setFormData({ ...formData, socialmediaLink: e.target.value });
              setErrors((prevErrors) => ({ ...prevErrors, socialmediaLink: "" }));
            }}
            error={!!errors.socialmediaLink}
            helperText={errors.socialmediaLink}
            required
            sx={{ mt: 2 }}
            placeholder="https://example.com"
          />
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

export default ContactInfo;