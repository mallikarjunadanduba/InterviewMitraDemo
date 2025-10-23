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
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { createSkill, getSkillById, getAllSkillData, updateESkill, deleteSkill } from "views/API/AdditionalDetailsApi";
import Swal from 'sweetalert2';

const AdditionalDetails = () => {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [skills, setSkills] = useState([]);

  const [formData, setFormData] = useState({
    skillName: "",
  });

  const user = JSON.parse(sessionStorage.getItem("user"));
  const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user?.accessToken,
  };

  // Fetch skills when component mounts
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");
        if (!jobseekerProfileId) {
          console.error("Jobseeker Profile ID not found in session storage.");
          return;
        }
        const response = await getSkillById(jobseekerProfileId, headers);
        if (Array.isArray(response.data)) {
          setSkills(response.data);
        } else {
          console.error("Unexpected API response format", response);
          setSkills([]);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        setSkills([]);
      }
    };

    fetchSkills();
  }, []);

  const handleOpen = async (index = null) => {
    if (index !== null) {
      const skillId = skills[index]?.skillId;
      console.log("Editing Skill ID:", skillId);

      try {
        const response = await getAllSkillData(skillId, headers);
        console.log("Detailed Skill Data:", response);
        
        if (response) {
          setFormData({
            skillName: response.skillName || "",
            skillId: response.skillId || "",
          });
          setEditIndex(index);
        }
      } catch (error) {
        console.error("Error fetching skill data:", error);
      }
    } else {
      setFormData({
        skillName: "",
        skillId: null,
      });
      setEditIndex(null);
    }

    setErrors({});
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (!formData.skillName.trim()) {
      setErrors({ ...errors, skillName: "Skill cannot be empty." });
      return;
    }

    // Check for duplicates (case insensitive)
    const lowerCaseSkills = skills.map((skill) => skill.skillName.toLowerCase());
    if (editIndex === null && lowerCaseSkills.includes(formData.skillName.trim().toLowerCase())) {
      setErrors({ ...errors, skillName: "This skill already exists." });
      return;
    }

    if (!user?.seekerId || !jobseekerProfileId) {
      setErrors({ ...errors, skillName: "User information is incomplete. Please log in again." });
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'User information is incomplete. Please log in again.',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      if (editIndex !== null) {
        // Update existing skill
        const skillToUpdate = skills[editIndex];
        const updateData = {
          jobSeekerDtoList: { seekerId: user.seekerId },
          jobSeekerProfileDtoList: { jobseekerProfileId },
          skillId: skillToUpdate.skillId,
          skillName: formData.skillName.trim(),
        };

        await updateESkill(updateData, headers);
        
        // Update local state
        const updatedSkills = [...skills];
        updatedSkills[editIndex] = { ...skillToUpdate, skillName: formData.skillName.trim() };
        setSkills(updatedSkills);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Skill updated successfully!",
        });
      } else {
        // Add new skill
        const skillData = {
          jobSeekerDtoList: { seekerId: user.seekerId },
          jobSeekerProfileDtoList: { jobseekerProfileId },
          skillName: formData.skillName.trim(),
        };
        
        await createSkill(skillData, headers);
        
        // Refresh skills list
        const response = await getSkillById(jobseekerProfileId, headers);
        if (Array.isArray(response.data)) {
          setSkills(response.data);
        }

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Skill added successfully!",
        });
      }

      handleClose();
    } catch (error) {
      console.error("Error saving skill:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save skill. Please try again.",
      });
    }
  };

  const handleDelete = async (index) => {
    const skillToDelete = skills[index];

    if (!skillToDelete?.skillId) {
      console.error("Skill ID not found for deletion.");
      return;
    }

    try {
      await deleteSkill(skillToDelete.skillId, headers);

      // Remove the skill from state after successful API call
      setSkills(skills.filter((_, i) => i !== index));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Skill has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting skill:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete skill. Please try again.",
      });
    }
  };

  return (
    <Box sx={{mt:-2}}>
      {skills.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No skills added yet
          </Typography>
          <Button
            onClick={() => handleOpen()}
            variant="outlined"
            startIcon={<Add />}
          >
            Add Skill
          </Button>
        </Box>
      ) : (
        skills.map((skill, index) => (
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
                  <span style={{ color: '#666', fontWeight: 400 }}>Skill:</span>{' '}
                  <span style={{ fontWeight: 600 }}>{skill.skillName}</span>
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

      {skills.length > 0 && (
        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Tooltip title="Add another skill">
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
          {editIndex !== null ? "Edit Skill" : "Add Skill"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Skill Name"
            fullWidth
            value={formData.skillName}
            onChange={(e) => {
              setFormData({ ...formData, skillName: e.target.value });
              setErrors((prevErrors) => ({ ...prevErrors, skillName: "" }));
            }}
            error={!!errors.skillName}
            helperText={errors.skillName}
            required
            sx={{ mt: 2 }}
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

export default AdditionalDetails;
