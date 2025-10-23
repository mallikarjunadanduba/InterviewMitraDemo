import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { createCourse, deleteCourse, getBycourseId, getCourseBy_Id, updateCourse,  } from "views/API/CourseApi";

const Courses = () => {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [coursesList, setCoursesList] = useState([]);
  const [errors, setErrors] = useState({ courseName: "", description: "" });

  // Headers and tokens
  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user?.accessToken,
  };

  // Fetch courses from the server
  const fetchCourses = async () => {
   
    const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");

    try {
      const response = await getCourseBy_Id(headers, jobseekerProfileId);
      setCoursesList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Call fetchCourses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  //  Opens dialog for editing
  const handleOpen = async (index = null) => {
    if (index !== null) {
      const course = coursesList[index];  // Get the selected course
  
      try {
        // Fetch course data by ID
        const response = await getBycourseId(course.courseId,headers );
        console.log("Fetched Course Details:", response);
  
        if (response) {
          setCourseName(response.courseName);
          setDescription(response.description);
          setEditIndex(index); // Set the index to track editing
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    } else {
      // Reset fields for adding a new course
      setCourseName("");
      setDescription("");
      setEditIndex(null);
    }
  
    setErrors({ courseName: "", description: "" }); // Reset errors
    setOpen(true);
  };
  
  

  // Closes dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Saves the new/edited course
  const handleSave = async () => {
    if (!courseName.trim()) {
      setErrors({ ...errors, courseName: "Course Name is required" });
      return;
    }
    if (!description.trim()) {
      setErrors({ ...errors, description: "Description is required" });
      return;
    }

    const jobSeekerId = parseInt(user?.seekerId);
    const jobseekerProfileId = parseInt(sessionStorage.getItem("jobseekerProfileId"));

    const courseData = {
      courseId: editIndex !== null ? coursesList[editIndex]?.courseId : null, // Include courseId only if editing
      jobSeekerDtoList: { seekerId: jobSeekerId },
     jobSeekerProfileDtoList: { jobseekerProfileId: jobseekerProfileId  },
      courseName,
      description,
    };

    try {
      if (editIndex !== null) {
        // Update course if editing
        await updateCourse(courseData, headers);
      } else {
        // Create new course if adding
        await createCourse(courseData, headers);
      }

      handleClose(); // Close dialog on success

      // Refresh the course list after update
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  // Deletes a course
  const handleDelete = async (index) => {
    const courseId = coursesList[index].courseId;
  
    try {
      const isDeleted = await deleteCourse(courseId, headers);
      if (isDeleted) {
        // Remove the deleted course from the list
        setCoursesList(coursesList.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <Box sx={{mt:-2}}>
      {coursesList.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No courses added yet
          </Typography>
          <Button
            onClick={() => handleOpen(null)}
            variant="outlined"
            startIcon={<Add />}
          >
            Add Course
          </Button>
        </Box>
      ) : (
        coursesList.map((course, index) => (
          <Box
            key={course.courseId}
            sx={{
              backgroundColor: 'white',
              position: 'relative',
            }}
          >
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <span style={{ color: '#666', fontWeight: 400 }}>Course Name:</span>{' '}
                  <span style={{ fontWeight: 600 }}>{course.courseName}</span>
                </Typography>
                <Typography variant="body2">
                  <span style={{ color: '#666', fontWeight: 400 }}>Description:</span>{' '}
                  <span style={{ fontWeight: 600 }}>{course.description}</span>
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

      {coursesList.length > 0 && (
        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Tooltip title="Add another course">
            <span>
              <Button
                onClick={() => handleOpen(null)}
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
        <DialogTitle>{editIndex !== null ? "Edit Course" : "Add Course"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <TextField
            label="Course Name"
            variant="outlined"
            fullWidth
            value={courseName}
            error={!!errors.courseName}
            helperText={errors.courseName}
            onChange={(e) => {
              setCourseName(e.target.value);
              if (errors.courseName) setErrors({ ...errors, courseName: "" }); // Reset error
            }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={description}
            error={!!errors.description}
            helperText={errors.description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors({ ...errors, description: "" }); // Reset error
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: "#0095a5" }}>
            {editIndex !== null ? "Update" : "Add"}
          </Button>
          <Button onClick={handleClose} sx={{ color: "#0095a5" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Courses;