import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  IconButton, 
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Link
} from "@mui/material";
import { 
  KeyboardArrowDown, 
  Edit, 
  Share,
  Person,
  Phone,
  Email,
  LocationOn,
  Work,
  Language,
  LinkedIn
} from "@mui/icons-material";
import MainCard from "ui-component/cards/MainCard";
import BasicDetails from "./Profile/BasicDetails";
import MobileProfileCard from "./Profile/MobileProfileCard";
import EducationDetails from "./Profile/EducationDetails";
import ExperienceDetails from "./Profile/ExperienceDetails";
import AdditionalDetails from "./Profile/AdditionalDetails";
import UploadDetails from "./Profile/UploadDetails";
import ProjectDetails from "./Profile/ProjectDetails";
import Certification from "./Profile/Certification";
import Languages from "./Profile/Languages";
import Courses from "./Profile/Courses";
import ContactInfo from "./Profile/ContactInfo";
import Awards from "./Profile/Awards";
import Employment from "./Profile/Employment";
import axios from "axios";
import Swal from "sweetalert2";
import { BaseUrl } from "BaseUrl";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [profileData, setProfileData] = useState({
    jobseekerProfileName: "",
    description: "",
    email: "",
    mobileNumber: "",
    fileName: "",
    designation: "",
    location: "",
    linkedin: "",
    website: ""
  });
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editSection, setEditSection] = useState("");
  const [errors, setErrors] = useState({});
  const [jobseekerProfileId, setJobseekerProfileId] = useState(null);
  
  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken
  };
  
  const navigate = useNavigate();

  const handleButtonClick = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const jobSeekerId = parseInt(user?.seekerId);
        const response = await axios.get(
          `${BaseUrl}/jobseekerprofile/v1/getJobSeekerProfileByJobSeekerId/${jobSeekerId}`,
          { headers }
        );
        if (response.data) {
          const profileId = response.data.jobseekerProfileId || null;
          
          setJobseekerProfileId(profileId);
          sessionStorage.setItem("jobseekerProfileId", profileId);
      
          const newProfileData = {
            jobseekerProfileName: response.data.jobseekerProfileName || "",
            description: response.data.description || "",
            email: response.data.email || "",
            mobileNumber: response.data.mobileNumber || "",
            fileName: response.data.jobseekerProfilePicName || "",
            designation: response.data.designation || "",
            location: response.data.location || "",
            linkedin: response.data.linkedin || "",
            website: response.data.website || ""
          };
          setProfileData(newProfileData);
          setIsProfileCreated(true);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  const validateFields = () => {
    const newErrors = {};
    let isValid = true;
    
    console.log("Validating for section:", editSection); // Debug log
    console.log("Profile data being validated:", profileData); // Debug log
    
    if (editSection === "personal") {
      if (!profileData.jobseekerProfileName.trim()) {
        newErrors.jobseekerProfileName = "Profile name is required";
        isValid = false;
      } else if (profileData.jobseekerProfileName.trim().length < 3) {
        newErrors.jobseekerProfileName = "Profile name must be at least 3 characters";
        isValid = false;
      }
      if (!profileData.email.trim()) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
        isValid = false;
      }
      if (!profileData.mobileNumber.trim()) {
        newErrors.mobileNumber = "Mobile number is required";
        isValid = false;
      } else if (!/^[0-9]{10}$/.test(profileData.mobileNumber.trim())) {
        console.log("Mobile number validation failed:", profileData.mobileNumber); // Debug log
        newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
        isValid = false;
      }
      if (profileData.linkedin.trim() && !/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(profileData.linkedin.trim())) {
        newErrors.linkedin = "Please enter a valid LinkedIn URL";
        isValid = false;
      }
      if (profileData.website.trim() && !/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(profileData.website.trim())) {
        newErrors.website = "Please enter a valid website URL";
        isValid = false;
      }
    } else if (editSection === "about") {
      if (!profileData.description.trim()) {
        newErrors.description = "Description is required";
        isValid = false;
      } else if (profileData.description.trim().length > 200) {
        newErrors.description = "Description must be less than 200 characters";
        isValid = false;
      }
    }
    
    console.log("Validation errors:", newErrors); // Debug log
    console.log("Is valid:", isValid); // Debug log
    
    setErrors(newErrors);
    return isValid;
  };

  const handleEdit = (section) => {
    setEditSection(section);
    setOpenEditDialog(true);
    setErrors({});
  };

  const handleSave = async () => {
    console.log("Starting save process..."); // Debug log
    const validationResult = validateFields();
    console.log("Validation result:", validationResult); // Debug log
    
    if (!validationResult) {
      console.log("Validation failed, not proceeding with save"); // Debug log
      return;
    }
    
    console.log("Current profileData:", profileData); // Debug log
    
    const jobSeekerId = parseInt(user?.seekerId);
    console.log("Job Seeker ID:", jobSeekerId); // Debug log
    const requestData = {
      jobseekerProfileId: jobseekerProfileId || 0,
      jobSeekerDtoList: { 
        seekerId: jobSeekerId,
        mailId: profileData.email,
        mobileNumber: profileData.mobileNumber,
        userName: profileData.jobseekerProfileName
      },
      description: profileData.description,
      email: profileData.email,
      jobseekerProfileName: profileData.jobseekerProfileName,
      mobileNumber: profileData.mobileNumber,
      designation: profileData.designation,
      location: profileData.location,
      linkedin: profileData.linkedin,
      website: profileData.website,
      jobseekerProfilePicName: profileData.fileName || "",
      jobseekerProfileCoverPicName: ""
    };
    
    console.log("Request Data:", requestData); // Debug log
    console.log("Headers:", headers); // Debug log
    console.log("Is Profile Created:", isProfileCreated); // Debug log
    
    Swal.fire({ 
      title: isProfileCreated ? "Updating..." : "Saving...", 
      allowOutsideClick: false, 
      didOpen: () => Swal.showLoading() 
    });
    
    try {
      const endpoint = isProfileCreated 
        ? `${BaseUrl}/jobseekerprofile/v1/updateJobSeekerProfile`
        : `${BaseUrl}/jobseekerprofile/v1/createJobSeekerProfile`;
      
      console.log("API Endpoint:", endpoint); // Debug log
      
      const response = isProfileCreated
        ? await axios.put(endpoint, requestData, { headers })
        : await axios.post(endpoint, requestData, { headers });
      
      console.log("Response Status:", response.status); // Debug log
      console.log("Response Data:", response.data); // Debug log
      
      // Handle response based on the actual response structure
      if (response.data?.jobseekerProfileId) {
        setJobseekerProfileId(response.data.jobseekerProfileId);
        sessionStorage.setItem("jobseekerProfileId", response.data.jobseekerProfileId);
        setIsProfileCreated(true);
      }
      
      Swal.fire({ 
        icon: "success", 
        title: isProfileCreated ? "Updated!" : "Saved!", 
        timer: 2000, 
        showConfirmButton: false 
      });
      setIsProfileCreated(true);
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error details:", error.response?.data); // Debug log
      Swal.fire({ 
        icon: "error", 
        title: "Error", 
        text: error.response?.data?.message || "Failed to save profile" 
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handlePrintPreview = () => {
    navigate("/jobs/digitalpreview", {
      state: {
        profileData: {
          name: profileData.jobseekerProfileName,
          about: profileData.description,
          email: profileData.email,
          mobileNumber: profileData.mobileNumber
        }
      }
    });
  };

  const handlePrintPDF = () => {
    navigate("/jobs/resumedata");
  };

  const sections = [
    { label: "Employment", id: "employment" },
    { label: "Experience", id: "experience" },
    { label: "Education", id: "education" },
    { label: "Skills", id: "skills" },
    { label: "Upload Video", id: "uploadFiles" },
    { label: "Projects", id: "projects" },
    { label: "Certifications", id: "certifications" },
    { label: "Languages", id: "languages" },
    { label: "Courses", id: "courses" },
    { label: "Social Link", id: "contactInfo" },
    { label: "Awards", id: "awards" },
  ];

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', px: 0, py: 0 }}>
      {/* Mobile View */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <MobileProfileCard 
          profileData={profileData} 
          onEdit={handleEdit}
        />
      </Box>

      {/* Desktop View */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <MainCard sx={{ p: 0, m: 0 }}>
          
          <BasicDetails profileData={profileData} />
          
          <Box sx={{ px: 3 }}>
            <Grid container spacing={4}>
            {/* Left Column - Desktop Only */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Personal Details Section */}
                <Card sx={{ 
                  borderRadius: 2, 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ 
                        color: '#0095a5', 
                        fontWeight: 500,
                        fontFamily: 'Roboto',
                        fontStyle: 'Medium',
                        fontSize: '22px',
                        lineHeight: '124%',
                        letterSpacing: '1%',
                        verticalAlign: 'middle'
                      }}>
                        Personal Details
                      </Typography>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#0095a5' }}
                        onClick={() => handleEdit('personal')}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '20px' }}>
                        <Person fontSize="small" sx={{ color: '#0095a5' }} /> {profileData.jobseekerProfileName || "Name"}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '20px' }}>
                        <Phone fontSize="small" sx={{ color: '#0095a5' }} /> {profileData.mobileNumber || "Mobile Number"}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '20px' }}>
                        <Email fontSize="small" sx={{ color: '#0095a5' }} /> {profileData.email || "Email"}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '20px' }}>
                        <LocationOn fontSize="small" sx={{ color: '#0095a5' }} /> {profileData.location || "Location"}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '20px' }}>
                        <Work fontSize="small" sx={{ color: '#0095a5' }} /> {profileData.designation || "Designation"}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '20px' }}>
                        <Language fontSize="small" sx={{ color: '#0095a5' }} /> 
                        {profileData.website ? (
                          <Link 
                            href={profileData.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{ 
                              color: '#364152', 
                              textDecoration: 'underline',
                              fontSize: '20px',
                              '&:hover': { 
                                textDecoration: 'underline',
                                color: 'blue'
                              }
                            }}
                          >
                            Portfolio / Website
                          </Link>
                        ) : (
                          "Portfolio / Website"
                        )}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '20px' }}>
                        <LinkedIn fontSize="small" sx={{ color: '#0095a5' }} /> 
                        {profileData.linkedin ? (
                          <Link 
                            href={profileData.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{ 
                              color: '#364152',
                              textDecoration: 'underline',
                              fontSize: '20px',
                              '&:hover': { 
                                textDecoration: 'underline',
                                color: 'blue'
                              }
                            }}
                          >
                            LinkedIn
                          </Link>
                        ) : (
                          "LinkedIn"
                        )}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* About Section */}
                <Card sx={{ 
                  borderRadius: 2, 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ 
                        color: '#0095a5', 
                        fontWeight: 500,
                        fontFamily: 'Roboto',
                        fontStyle: 'Medium',
                        fontSize: '22px',
                        lineHeight: '124%',
                        letterSpacing: '1%',
                        verticalAlign: 'middle'
                      }}>
                        About
                      </Typography>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#0095a5' }}
                        onClick={() => handleEdit('about')}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 , fontSize: '20px'}}>
                      {profileData.description || "add your profile description here..."}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Preview and Print PDF Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  flexDirection: 'row'
                }}>
                  <Button
                    variant="outlined"
                    onClick={handlePrintPreview}
                    sx={{
                      borderColor: '#0095a5',
                      color: '#0095a5',
                      borderRadius: 2,
                      textTransform: 'none',
                      py: 1.5,
                      flex: 1,
                      '&:hover': {
                        borderColor: '#007a87',
                        backgroundColor: 'rgba(0, 149, 165, 0.1)',
                      }
                    }}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handlePrintPDF}
                    sx={{
                      backgroundColor: '#0095a5',
                      color: 'white',
                      borderRadius: 2,
                      textTransform: 'none',
                      py: 1.5,
                      flex: 1,
                      '&:hover': {
                        backgroundColor: '#007a87',
                      }
                    }}
                  >
                    Print PDF
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Right Column - Desktop, Full Width on Mobile */}
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                {/* All Sections */}
                {sections.map((section, index) => (
                  <Box key={section.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ 
                        color: '#0095a5', 
                        fontWeight: 500,
                        fontFamily: 'Roboto',
                        fontStyle: 'Medium',
                        fontSize: '20px',
                        lineHeight: '124%',
                        letterSpacing: '1%',
                        verticalAlign: 'middle'
                      }}>
                        {section.label}
                      </Typography>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          color: '#0095a5',
                          transform: activeSection === section.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease-in-out'
                        }}
                        onClick={() => handleButtonClick(section.id)}
                      >
                        <KeyboardArrowDown fontSize="medium" />
                      </IconButton>
                    </Box>
                    <Collapse in={activeSection === section.id}>
                      <Box sx={{ mt: 2 }}>
                        {section.id === "employment" && <Employment />}
                        {section.id === "education" && <EducationDetails />}
                        {section.id === "experience" && <ExperienceDetails />}
                        {section.id === "skills" && <AdditionalDetails />}
                        {section.id === "uploadFiles" && <UploadDetails />}
                        {section.id === "projects" && <ProjectDetails />}
                        {section.id === "certifications" && <Certification />}
                        {section.id === "languages" && <Languages />}
                        {section.id === "courses" && <Courses />}
                        {section.id === "contactInfo" && <ContactInfo />}
                        {section.id === "awards" && <Awards />}
                      </Box>
                    </Collapse>
                    {index < sections.length - 1 && (
                      <Divider sx={{ my: 1.8 }} />
                    )}
                  </Box>
                ))}

              </Box>
            </Grid>
          </Grid>
          </Box>
        </MainCard>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editSection === 'personal' ? 'Edit Personal Details' : 'Edit About'}
        </DialogTitle>
        <DialogContent>
          {editSection === 'personal' ? (
            <>
              <TextField
                name="jobseekerProfileName"
                label="Profile Name"
                fullWidth
                value={profileData.jobseekerProfileName}
                onChange={handleInputChange}
                error={!!errors.jobseekerProfileName}
                helperText={errors.jobseekerProfileName}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={profileData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                name="mobileNumber"
                label="Mobile Number"
                fullWidth
                value={profileData.mobileNumber}
                onChange={handleInputChange}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
                inputProps={{ maxLength: 10 }}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                name="designation"
                label="Designation"
                fullWidth
                value={profileData.designation}
                onChange={handleInputChange}
                error={!!errors.designation}
                helperText={errors.designation}
                sx={{ mb: 2 }}
              />
              <TextField
                name="location"
                label="Location"
                fullWidth
                value={profileData.location}
                onChange={handleInputChange}
                error={!!errors.location}
                helperText={errors.location}
                sx={{ mb: 2 }}
              />
              <TextField
                name="website"
                label="Website / Portfolio"
                fullWidth
                value={profileData.website}
                onChange={handleInputChange}
                error={!!errors.website}
                helperText={errors.website}
                placeholder="https://example.com"
                sx={{ mb: 2 }}
              />
              <TextField
                name="linkedin"
                label="LinkedIn"
                fullWidth
                value={profileData.linkedin}
                onChange={handleInputChange}
                error={!!errors.linkedin}
                helperText={errors.linkedin}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </>
          ) : (
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={profileData.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
              inputProps={{ maxLength: 300 }}
              required
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ backgroundColor: "#0095a5", color: "white" }}
          >
            {isProfileCreated ? "Update" : "Save"}
          </Button>
          <Button onClick={() => setOpenEditDialog(false)} sx={{ color: "#0095a5" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
