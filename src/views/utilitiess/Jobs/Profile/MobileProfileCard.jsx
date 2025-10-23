import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  IconButton, 
  Button,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  CircularProgress,
  Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Swal from "sweetalert2";
import { BaseUrl } from "BaseUrl";
import { useNavigate } from "react-router-dom";
import {
  saveOrUpdateJobSeekerProfileCoverPic,
  saveOrUpdateJobSeekerProfilePic,
} from "views/API/jobSeekerProfileApi";
import useSecureImage from "hooks/useSecureImage";
// Import API functions for all sections
import { 
  getEmploymentById, 
  createEmployment, 
  updateEmployment, 
  deleteEmployment,
  getEmployment_Id 
} from "views/API/EmploymentApi";
import { 
  getEducationById, 
  createEducation, 
  updateEducation, 
  deleteEducation,
  getAllEducation 
} from "views/API/EducationApi";
import { 
  getAllExperiences, 
  createExperience, 
  updateExperience, 
  deleteExperience,
  getExperienceById 
} from "views/API/ExperienceApi";
import { 
  getSkillById, 
  createSkill, 
  updateESkill, 
  deleteSkill,
  getAllSkillData 
} from "views/API/AdditionalDetailsApi";
import { 
  getProjectById, 
  createproject, 
  updateProject, 
  deleteProject,
  getProjectId 
} from "views/API/ProjectApi";
import { 
  getCertificateBy_Id, 
  createCertificate, 
  updateCertificate, 
  deleteCertificate,
  getCertificateDetails 
} from "views/API/CertificateApi";
import { 
  getLanguageByProfileId, 
  createLanguage, 
  updateLanguage, 
  deleteLanguage,
  getLanguageId 
} from "views/API/LanguageApi";
import { 
  getCourseBy_Id, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  getBycourseId 
} from "views/API/CourseApi";
import { 
  getSocialmediaById, 
  createSocialmedia, 
  updatesocialmedia, 
  deleteSocialMedia,
  getSocialmediaDetails 
} from "views/API/SocialMediaApi";
import { 
  getAwardsById, 
  createAwards, 
  updateAward, 
  deleteAwards,
  getAwardsId 
} from "views/API/AwardsApi";
import { 
  createVideo, 
  deleteVideo, 
  getVideoById, 
  getBy_ViedoId, 
  updateVideo 
} from "views/API/UploadDetailsApi";

const MobileProfileCard = ({ profileData, onEdit }) => {
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [aboutEditSection, setAboutEditSection] = useState("");
  const [errors, setErrors] = useState({});
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [jobseekerProfileId, setJobseekerProfileId] = useState(null);
  
  // State variables for all section data
  const [employmentData, setEmploymentData] = useState([]);
  const [currentEmploymentData, setCurrentEmploymentData] = useState(null);
  const [canAddCurrentEmployment, setCanAddCurrentEmployment] = useState(true);
  const [educationData, setEducationData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [certificationsData, setCertificationsData] = useState([]);
  const [languagesData, setLanguagesData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [contactInfoData, setContactInfoData] = useState([]);
  const [awardsData, setAwardsData] = useState([]);
  const [videoData, setVideoData] = useState(null);
  
  // Loading states for each section
  const [loadingStates, setLoadingStates] = useState({
    employment: false,
    currentEmployment: false,
    education: false,
    experience: false,
    skills: false,
    projects: false,
    certifications: false,
    languages: false,
    courses: false,
    contactInfo: false,
    awards: false,
    video: false
  });

  // Edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editSection, setEditSection] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Form data for different sections
  const [employmentForm, setEmploymentForm] = useState({
    jobTitle: "",
    companyName: "",
    employmentType: "",
    currentctc: "",
    skill: "",
    jobDescription: "",
    noticePeriod: "",
  });

  const [educationForm, setEducationForm] = useState({
    educationName: "",
    institutionName: "",
    percentage: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [experienceForm, setExperienceForm] = useState({
    companyName: "",
    designation: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [skillForm, setSkillForm] = useState({
    skillName: "",
  });

  const [projectForm, setProjectForm] = useState({
    projectName: "",
    description: "",
    projectUrl: "",
    skill: "",
  });

  const [certificationForm, setCertificationForm] = useState({
    certificateName: "",
    fileName: "",
  });

  const [languageForm, setLanguageForm] = useState({
    languageName: "",
  });

  const [courseForm, setCourseForm] = useState({
    courseName: "",
    description: "",
  });

  const [contactForm, setContactForm] = useState({
    socialmediaName: "",
    socialmediaLink: "",
  });

  const [awardForm, setAwardForm] = useState({
    awardName: "",
    fileName: "",
  });

  const [currentEmploymentForm, setCurrentEmploymentForm] = useState({
    jobTitle: "",
    companyName: "",
    employmentType: "",
    currentctc: "",
    skill: "",
    jobDescription: "",
    noticePeriod: "",
  });

  const [videoForm, setVideoForm] = useState({
    videoLink: "",
    subject: "",
  });
  
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

  // Extract YouTube ID from various URL formats
  const getYouTubeId = (url) => {
    if (!url) return null;

    if (url.includes('youtube.com/embed/')) {
      return url.split('embed/')[1].split('?')[0];
    }

    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0];
    }

    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }

    return url;
  };

  const profileImageUrl = useSecureImage(profileImage, user.accessToken);
  const coverImageUrl = useSecureImage(coverImage, user.accessToken);

  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const jobSeekerId = parseInt(user?.seekerId);
        const headers = {
          "Content-type": "application/json",
          Authorization: "Bearer " + user.accessToken,
        };
        const response = await axios.get(
          `${BaseUrl}/jobseekerprofile/v1/getJobSeekerProfileByJobSeekerId/${jobSeekerId}`,
          { headers }
        );
        if (response.data) {
          if (response.data.jobseekerProfilePicPath) {
            setProfileImage(response.data.jobseekerProfilePicPath);
          }
          if (response.data.jobseekerProfileCoverPicPath) {
            setCoverImage(response.data.jobseekerProfileCoverPicPath);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  // Fetch all section data when component mounts
  useEffect(() => {
    const profileId = sessionStorage.getItem("jobseekerProfileId");
    if (profileId) {
      fetchAllSectionData();
    }
  }, []);

  // Function to fetch data for all sections
  const fetchAllSectionData = async () => {
    const profileId = sessionStorage.getItem("jobseekerProfileId");
    if (!profileId) return;

    try {
      // Fetch all section data in parallel
      await Promise.all([
        fetchEmploymentData(profileId),
        fetchCurrentEmploymentData(profileId),
        fetchEducationData(profileId),
        fetchExperienceData(profileId),
        fetchSkillsData(profileId),
        fetchProjectsData(profileId),
        fetchCertificationsData(profileId),
        fetchLanguagesData(profileId),
        fetchCoursesData(profileId),
        fetchContactInfoData(profileId),
        fetchAwardsData(profileId),
        fetchVideoData(profileId)
      ]);
    } catch (error) {
      console.error("Error fetching section data:", error);
    }
  };

  // Individual fetch functions for each section
  const fetchEmploymentData = async (profileId) => {
    setLoadingStates(prev => ({ ...prev, employment: true }));
    try {
      const response = await getAllExperiences(profileId, headers);
      if (response?.data) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setEmploymentData(data);
      }
    } catch (error) {
      console.error("Error fetching employment data:", error);
      setEmploymentData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, employment: false }));
    }
  };

  const fetchEducationData = async (profileId) => {
    setLoadingStates(prev => ({ ...prev, education: true }));
    try {
      const response = await getEducationById(profileId, headers);
      if (response?.data) {
        setEducationData(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (error) {
      console.error("Error fetching education data:", error);
      setEducationData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, education: false }));
    }
  };

  const fetchExperienceData = async (profileId) => {
    setLoadingStates(prev => ({ ...prev, experience: true }));
    try {
      const response = await getAllExperiences(profileId, headers);
      if (response?.data) {
        setExperienceData(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error fetching experience data:", error);
      setExperienceData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, experience: false }));
    }
  };

  const fetchSkillsData = async (profileId) => {
    setLoadingStates(prev => ({ ...prev, skills: true }));
    try {
      const response = await getSkillById(profileId, headers);
      if (response?.data) {
        setSkillsData(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (error) {
      console.error("Error fetching skills data:", error);
      setSkillsData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, skills: false }));
    }
  };

  const fetchProjectsData = async (profileId) => {
    setLoadingStates(prev => ({ ...prev, projects: true }));
    try {
      const response = await getProjectById(headers, profileId);
      if (response?.data) {
        setProjectsData(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (error) {
      console.error("Error fetching projects data:", error);
      setProjectsData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, projects: false }));
    }
  };

  const fetchCertificationsData = async (profileId) => {
    setLoadingStates(prev => ({ ...prev, certifications: true }));
    try {
      const response = await getCertificateBy_Id(headers, profileId);
      if (response?.data) {
        setCertificationsData(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (error) {
      console.error("Error fetching certifications data:", error);
      setCertificationsData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, certifications: false }));
    }
  };

  const fetchLanguagesData = async (profileId) => {
    setLoadingStates(prev => ({ ...prev, languages: true }));
    try {
      const response = await getLanguageByProfileId(headers, profileId);
      if (response?.data) {
        setLanguagesData(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (error) {
      console.error("Error fetching languages data:", error);
      setLanguagesData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, languages: false }));
    }
  };

  const fetchCoursesData = async (profileId) => {
    setLoadingStates(prev => ({ ...prev, courses: true }));
    try {
      const response = await getCourseBy_Id(headers, profileId);
      if (response?.data) {
        setCoursesData(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (error) {
      console.error("Error fetching courses data:", error);
      setCoursesData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, courses: false }));
    }
  };

  const fetchContactInfoData = async (profileId) => {
    setLoadingStates(prev => ({ ...prev, contactInfo: true }));
    try {
      const response = await getSocialmediaById(headers, profileId);
      if (response?.data) {
        setContactInfoData(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (error) {
      console.error("Error fetching contact info data:", error);
      setContactInfoData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, contactInfo: false }));
    }
  };

  const fetchAwardsData = async (profileId) => {
    setLoadingStates(prev => ({ ...prev, awards: true }));
    try {
      const response = await getAwardsById(headers, profileId);
      if (response?.data) {
        setAwardsData(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (error) {
      console.error("Error fetching awards data:", error);
      setAwardsData([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, awards: false }));
    }
  };

  const fetchCurrentEmploymentData = async (profileId) => {
    setLoadingStates(prev => ({ ...prev, currentEmployment: true }));
    try {
      const response = await getEmploymentById(headers, profileId);
      if (response?.data) {
        setCurrentEmploymentData(response.data);
        setCanAddCurrentEmployment(false);
      } else {
        setCurrentEmploymentData(null);
        setCanAddCurrentEmployment(true);
      }
    } catch (error) {
      console.error("Error fetching current employment data:", error);
      setCurrentEmploymentData(null);
      setCanAddCurrentEmployment(true);
    } finally {
      setLoadingStates(prev => ({ ...prev, currentEmployment: false }));
    }
  };

  const fetchVideoData = async (profileId) => {
    setLoadingStates(prev => ({ ...prev, video: true }));
    try {
      const response = await getVideoById(headers, profileId);
      if (response?.data && response.data.length > 0) {
        // Get the first video (assuming single video per profile)
        setVideoData(response.data[0]);
      } else {
        setVideoData(null);
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
      setVideoData(null);
    } finally {
      setLoadingStates(prev => ({ ...prev, video: false }));
    }
  };

  // Edit dialog functions
  const handleEditOpen = async (section, index = null) => {
    // Check if trying to add new current employment when one already exists
    if (section === 'currentEmployment' && index === null && !canAddCurrentEmployment) {
      Swal.fire({
        icon: "info",
        title: "Limit Reached",
        text: "You can only have one current employment record. Please edit or delete the existing record.",
      });
      return;
    }
    
    setEditSection(section);
    setEditIndex(index);
    setEditErrors({});
    setEditLoading(false);

    // Reset form data
    const resetForms = () => {
      setEmploymentForm({
        jobTitle: "",
        companyName: "",
        employmentType: "",
        currentctc: "",
        skill: "",
        jobDescription: "",
        noticePeriod: "",
      });
      setEducationForm({
        educationName: "",
        institutionName: "",
        percentage: "",
        description: "",
        startDate: "",
        endDate: "",
      });
      setExperienceForm({
        companyName: "",
        designation: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setSkillForm({ skillName: "" });
      setProjectForm({
        projectName: "",
        description: "",
        projectUrl: "",
        skill: "",
      });
      setCertificationForm({
        certificateName: "",
        fileName: "",
      });
      setLanguageForm({ languageName: "" });
      setCourseForm({
        courseName: "",
        description: "",
      });
      setContactForm({
        socialmediaName: "",
        socialmediaLink: "",
      });
      setAwardForm({
        awardName: "",
        fileName: "",
      });
      setCurrentEmploymentForm({
        jobTitle: "",
        companyName: "",
        employmentType: "",
        currentctc: "",
        skill: "",
        jobDescription: "",
        noticePeriod: "",
      });
      setVideoForm({
        videoLink: "",
        subject: "",
      });
    };

    if (index !== null) {
      // Editing existing item - fetch data
      try {
        setEditLoading(true);
        const profileId = sessionStorage.getItem("jobseekerProfileId");
        
        switch (section) {
          case 'employment':
            const empData = employmentData[index];
            const empResponse = await getExperienceById(headers, empData.experienceId);
            if (empResponse?.data) {
              setEmploymentForm({
                jobTitle: empResponse.data.designation || "",
                companyName: empResponse.data.companyName || "",
                fromDate: empResponse.data.fromDate || "",
                toDate: empResponse.data.toDate || "",
                jobDescription: empResponse.data.description || "",
                employmentType: "",
                currentctc: "",
                skill: "",
                noticePeriod: "",
              });
            }
            break;
          case 'education':
            const eduData = educationData[index];
            const eduResponse = await getAllEducation(eduData.educationId, headers);
            if (eduResponse) {
              setEducationForm({
                educationName: eduResponse.educationName || "",
                institutionName: eduResponse.instituteName || "",
                percentage: eduResponse.percentage || "",
                description: eduResponse.description || "",
                startDate: eduResponse.fromDate || "",
                endDate: eduResponse.toDate || "",
              });
            }
            break;
          case 'experience':
            const expData = experienceData[index];
            const expResponse = await getExperienceById(headers, expData.experienceId);
            if (expResponse?.data) {
              setExperienceForm({
                companyName: expResponse.data.companyName || "",
                designation: expResponse.data.designation || "",
                startDate: expResponse.data.fromDate || "",
                endDate: expResponse.data.toDate || "",
                description: expResponse.data.description || "",
              });
            }
            break;
          case 'skills':
            const skillData = skillsData[index];
            const skillResponse = await getAllSkillData(skillData.skillId, headers);
            if (skillResponse) {
              setSkillForm({
                skillName: skillResponse.skillName || "",
              });
            }
            break;
          case 'projects':
            const projData = projectsData[index];
            const projResponse = await getProjectId(headers, projData.projectId);
            if (projResponse) {
              setProjectForm({
                projectName: projResponse.projectName || "",
                description: projResponse.description || "",
                projectUrl: projResponse.projectUrl || "",
                skill: projResponse.skill || "",
              });
            }
            break;
          case 'certifications':
            const certData = certificationsData[index];
            const certResponse = await getCertificateDetails(certData.certificateId, headers);
            if (certResponse) {
              setCertificationForm({
                certificateName: certResponse.certificateName || "",
                fileName: certResponse.fileName || "",
              });
            }
            break;
          case 'languages':
            const langData = languagesData[index];
            const langResponse = await getLanguageId(langData.languageId, headers);
            if (langResponse) {
              setLanguageForm({
                languageName: langResponse.languageName || "",
              });
            }
            break;
          case 'courses':
            const courseData = coursesData[index];
            const courseResponse = await getBycourseId(courseData.courseId, headers);
            if (courseResponse) {
              setCourseForm({
                courseName: courseResponse.courseName || "",
                description: courseResponse.description || "",
              });
            }
            break;
          case 'contactInfo':
            const contactData = contactInfoData[index];
            const contactResponse = await getSocialmediaDetails(contactData.socialMediaId, headers);
            if (contactResponse) {
              setContactForm({
                socialmediaName: contactResponse.socialmediaName || "",
                socialmediaLink: contactResponse.socialmediaLink || "",
              });
            }
            break;
          case 'awards':
            const awardData = awardsData[index];
            const awardResponse = await getAwardsId(headers, awardData.awardId);
            if (awardResponse) {
              setAwardForm({
                awardName: awardResponse.awardName || "",
                fileName: awardResponse.fileName || "",
              });
            }
            break;
          case 'currentEmployment':
            if (currentEmploymentData) {
              setCurrentEmploymentForm({
                jobTitle: currentEmploymentData.jobTitle || "",
                companyName: currentEmploymentData.companyName || "",
                employmentType: currentEmploymentData.employmentType || "",
                currentctc: currentEmploymentData.currentctc || "",
                skill: currentEmploymentData.skill || "",
                jobDescription: currentEmploymentData.jobDescription || "",
                noticePeriod: currentEmploymentData.noticePeriod || "",
              });
            }
            break;
          case 'video':
            if (videoData) {
              setVideoForm({
                videoLink: videoData.videoLink || "",
                subject: videoData.subject || "",
              });
            }
            break;
        }
      } catch (error) {
        console.error("Error fetching data for editing:", error);
        Swal.fire("Error", "Failed to load data for editing", "error");
      } finally {
        setEditLoading(false);
      }
    } else {
      // Adding new item - reset forms
      resetForms();
    }

    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditSection("");
    setEditIndex(null);
    setEditErrors({});
    setEditLoading(false);
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    const profileId = sessionStorage.getItem("jobseekerProfileId");
    const jobSeekerId = parseInt(user?.seekerId);

    try {
      switch (editSection) {
        case 'employment':
          await handleEmploymentSave();
          break;
        case 'education':
          await handleEducationSave();
          break;
        case 'experience':
          await handleExperienceSave();
          break;
        case 'skills':
          await handleSkillSave();
          break;
        case 'projects':
          await handleProjectSave();
          break;
        case 'certifications':
          await handleCertificationSave();
          break;
        case 'languages':
          await handleLanguageSave();
          break;
        case 'courses':
          await handleCourseSave();
          break;
        case 'contactInfo':
          await handleContactSave();
          break;
        case 'awards':
          await handleAwardSave();
          break;
        case 'currentEmployment':
          await handleCurrentEmploymentSave();
          break;
        case 'video':
          await handleVideoSave();
          break;
      }
      
      // Refresh the specific section data
      await refreshSectionData(editSection);
      
      Swal.fire("Success", `${editSection} ${editIndex !== null ? 'updated' : 'added'} successfully!`, "success");
      handleEditClose();
    } catch (error) {
      console.error("Error saving data:", error);
      Swal.fire("Error", "Failed to save data", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const refreshSectionData = async (section) => {
    const profileId = sessionStorage.getItem("jobseekerProfileId");
    switch (section) {
      case 'employment':
        await fetchEmploymentData(profileId);
        break;
      case 'education':
        await fetchEducationData(profileId);
        break;
      case 'experience':
        await fetchExperienceData(profileId);
        break;
      case 'skills':
        await fetchSkillsData(profileId);
        break;
      case 'projects':
        await fetchProjectsData(profileId);
        break;
      case 'certifications':
        await fetchCertificationsData(profileId);
        break;
      case 'languages':
        await fetchLanguagesData(profileId);
        break;
      case 'courses':
        await fetchCoursesData(profileId);
        break;
      case 'contactInfo':
        await fetchContactInfoData(profileId);
        break;
      case 'awards':
        await fetchAwardsData(profileId);
        break;
      case 'currentEmployment':
        await fetchCurrentEmploymentData(profileId);
        break;
      case 'video':
        await fetchVideoData(profileId);
        break;
    }
  };

  // Individual save functions for each section
  const handleEmploymentSave = async () => {
    const profileId = parseInt(sessionStorage.getItem("jobseekerProfileId"));
    const jobSeekerId = parseInt(user?.seekerId);
    
    const employmentDataToSave = {
      employmentId: editIndex !== null ? employmentData[editIndex]?.employmentId : null,
      companyName: employmentForm.companyName,
      jobTitle: employmentForm.jobTitle,
      skill: employmentForm.skill,
      jobDescription: employmentForm.jobDescription,
      noticePeriod: employmentForm.noticePeriod,
      currentctc: employmentForm.currentctc,
      employmentType: employmentForm.employmentType,
      createdDate: null,
      updatedDate: null,
      jobSeekerDtoList: { seekerId: jobSeekerId },
      jobSeekerProfileDtoList: { jobseekerProfileId: profileId },
    };

    if (editIndex !== null) {
      await updateEmployment(employmentDataToSave, headers);
    } else {
      await createEmployment(employmentDataToSave, headers);
    }
  };

  const handleEducationSave = async () => {
    const profileId = sessionStorage.getItem("jobseekerProfileId");
    const jobSeekerId = user?.seekerId;
    
    const educationDataToSave = {
      educationId: editIndex !== null ? educationData[editIndex]?.educationId : undefined,
      educationName: educationForm.educationName,
      fromDate: educationForm.startDate ? new Date(educationForm.startDate).toISOString() : "",
      toDate: educationForm.endDate ? new Date(educationForm.endDate).toISOString() : "",
      instituteName: educationForm.institutionName,
      percentage: educationForm.percentage ? parseFloat(educationForm.percentage) : 0,
      description: educationForm.description || "",
      jobSeekerDtoList: { seekerId: jobSeekerId },
      jobSeekerProfileDtoList: { jobseekerProfileId: profileId },
    };

    if (editIndex !== null) {
      await updateEducation(educationDataToSave, headers);
    } else {
      await createEducation(educationDataToSave, headers);
    }
  };

  const handleExperienceSave = async () => {
    const profileId = parseInt(sessionStorage.getItem("jobseekerProfileId"));
    const jobSeekerId = parseInt(user?.seekerId);
    
    // Calculate experience years
    const calculateYearsOfExperience = (startDate, endDate) => {
      if (!startDate || !endDate) return 0;
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      return diffInMonths / 12;
    };

    const experienceYears = calculateYearsOfExperience(experienceForm.startDate, experienceForm.endDate);

    const experienceDataToSave = {
      companyName: experienceForm.companyName.trim(),
      designation: experienceForm.designation.trim(),
      description: experienceForm.description.trim(),
      experienceYears: experienceYears,
      fromDate: experienceForm.startDate ? experienceForm.startDate : "",
      toDate: experienceForm.endDate ? experienceForm.endDate : "",
      jobSeekerDtoList: {
        seekerId: jobSeekerId
      },
      jobSeekerProfileDtoList: {
        seekerId: jobSeekerId,
        profileId: profileId
      }
    };

    // If editing, include the experienceId
    if (editIndex !== null && experienceData[editIndex]?.experienceId) {
      experienceDataToSave.experienceId = experienceData[editIndex].experienceId;
    }

    if (editIndex !== null) {
      await updateExperience(experienceDataToSave, headers);
    } else {
      await createExperience(experienceDataToSave, headers);
    }
  };

  const handleSkillSave = async () => {
    const profileId = sessionStorage.getItem("jobseekerProfileId");
    const jobSeekerId = user?.seekerId;
    
    if (editIndex !== null) {
      // Update existing skill
      const skillToUpdate = skillsData[editIndex];
      const updateData = {
        jobSeekerDtoList: { seekerId: jobSeekerId },
        jobSeekerProfileDtoList: { jobseekerProfileId: profileId },
        skillId: skillToUpdate.skillId,
        skillName: skillForm.skillName.trim(),
      };
      await updateESkill(updateData, headers);
    } else {
      // Add new skill
      const skillDataToSave = {
        jobSeekerDtoList: { seekerId: jobSeekerId },
        jobSeekerProfileDtoList: { jobseekerProfileId: profileId },
        skillName: skillForm.skillName.trim(),
      };
      await createSkill(skillDataToSave, headers);
    }
  };

  const handleProjectSave = async () => {
    const profileId = parseInt(sessionStorage.getItem("jobseekerProfileId"));
    const jobSeekerId = parseInt(user?.seekerId);
    
    const projectDataToSave = {
      ...(editIndex !== null && projectsData[editIndex]?.projectId && { projectId: projectsData[editIndex].projectId }),
      jobSeekerDtoList: { seekerId: jobSeekerId },
      jobSeekerProfileDtoList: { jobseekerProfileId: profileId },
      projectName: projectForm.projectName,
      description: projectForm.description,
      projectUrl: projectForm.projectUrl,
      skill: projectForm.skill,
    };

    if (editIndex !== null) {
      await updateProject(projectDataToSave, headers);
    } else {
      await createproject(projectDataToSave, headers);
    }
  };

  const handleCertificationSave = async () => {
    const profileId = parseInt(sessionStorage.getItem("jobseekerProfileId"));
    const jobSeekerId = parseInt(user?.seekerId);
    
    const certificationDataToSave = {
      certificateId: editIndex !== null ? certificationsData[editIndex]?.certificateId : undefined,
      certificateName: certificationForm.certificateName,
      fileName: certificationForm.fileName,
      jobSeekerDtoList: { seekerId: jobSeekerId },
      jobSeekerProfileDtoList: { jobseekerProfileId: profileId },
    };

    if (editIndex !== null) {
      await updateCertificate(certificationDataToSave, headers);
    } else {
      await createCertificate(certificationDataToSave, headers);
    }
  };

  const handleLanguageSave = async () => {
    const profileId = parseInt(sessionStorage.getItem("jobseekerProfileId"));
    const jobSeekerId = parseInt(user?.seekerId);
    
    const languageDataToSave = {
      languageId: editIndex !== null ? languagesData[editIndex]?.languageId : 0,
      languageName: languageForm.languageName.trim(),
      jobSeekerDtoList: {
        seekerId: jobSeekerId
      },
      jobSeekerProfileDtoList: {
        jobseekerProfileId: profileId
      }
    };

    if (editIndex !== null) {
      await updateLanguage(languageDataToSave, headers);
    } else {
      await createLanguage(languageDataToSave, headers);
    }
  };

  const handleCourseSave = async () => {
    const profileId = parseInt(sessionStorage.getItem("jobseekerProfileId"));
    const jobSeekerId = parseInt(user?.seekerId);
    
    const courseDataToSave = {
      courseId: editIndex !== null ? coursesData[editIndex]?.courseId : null,
      jobSeekerDtoList: { seekerId: jobSeekerId },
      jobSeekerProfileDtoList: { jobseekerProfileId: profileId },
      courseName: courseForm.courseName,
      description: courseForm.description,
    };

    if (editIndex !== null) {
      await updateCourse(courseDataToSave, headers);
    } else {
      await createCourse(courseDataToSave, headers);
    }
  };

  const handleContactSave = async () => {
    const profileId = parseInt(sessionStorage.getItem("jobseekerProfileId"));
    const jobSeekerId = parseInt(user?.seekerId);
    
    const contactDataToSave = {
      socialMediaId: editIndex !== null ? contactInfoData[editIndex]?.socialMediaId : null,
      socialmediaName: contactForm.socialmediaName,
      socialmediaLink: contactForm.socialmediaLink.trim(),
      jobSeekerDtoList: { 
        seekerId: jobSeekerId,
        mailId: user?.mailId || "",
        mobileNumber: user?.mobileNumber || "",
        userName: user?.userName || ""
      },
      jobSeekerProfileDtoList: { 
        jobseekerProfileId: profileId,
        jobseekerProfileName: user?.jobseekerProfileName || ""
      },
    };

    if (editIndex !== null) {
      await updatesocialmedia(contactDataToSave, headers);
    } else {
      await createSocialmedia(contactDataToSave, headers);
    }
  };

  const handleAwardSave = async () => {
    const profileId = sessionStorage.getItem("jobseekerProfileId");
    const jobSeekerId = user?.seekerId;
    
    let awardDataToSave;

    if (editIndex !== null) {
      // Payload for updating an existing award (PUT)
      awardDataToSave = {
        awardId: awardsData[editIndex].awardId,
        awardName: awardForm.awardName,
        fileName: awardForm.fileName,
        filePath: awardForm.filePath,
        jobSeekerDtoList: { seekerId: jobSeekerId },
        jobSeekerProfileDtoList: { jobseekerProfileId: profileId },
      };
    } else {
      // Payload for creating a new award (POST)
      awardDataToSave = {
        awardName: awardForm.awardName,
        fileName: awardForm.fileName,
        jobSeekerDtoList: { seekerId: jobSeekerId },
        jobSeekerProfileDtoList: { jobseekerProfileId: profileId },
      };
    }

    if (editIndex !== null) {
      await updateAward(awardDataToSave, headers);
    } else {
      await createAwards(awardDataToSave, headers);
    }
  };

  const handleCurrentEmploymentSave = async () => {
    const profileId = sessionStorage.getItem("jobseekerProfileId");
    const jobSeekerId = parseInt(user?.seekerId);
    
    const employmentDataToSave = {
      employmentId: currentEmploymentData?.employmentId || null,
      companyName: currentEmploymentForm.companyName,
      jobTitle: currentEmploymentForm.jobTitle,
      skill: currentEmploymentForm.skill,
      jobDescription: currentEmploymentForm.jobDescription,
      noticePeriod: currentEmploymentForm.noticePeriod,
      currentctc: currentEmploymentForm.currentctc,
      employmentType: currentEmploymentForm.employmentType,
      createdDate: null,
      updatedDate: null,
      jobSeekerDtoList: { seekerId: jobSeekerId },
      jobSeekerProfileDtoList: { jobseekerProfileId: parseInt(profileId) },
    };

    if (currentEmploymentData?.employmentId) {
      await updateEmployment(employmentDataToSave, headers);
    } else {
      await createEmployment(employmentDataToSave, headers);
      setCanAddCurrentEmployment(false);
    }
  };

  const handleVideoSave = async () => {
    const profileId = parseInt(sessionStorage.getItem("jobseekerProfileId"));
    const jobSeekerId = parseInt(user?.seekerId);
    
    const youtubeId = getYouTubeId(videoForm.videoLink);
    
    const videoPayload = {
      videoId: editIndex !== null ? videoData[editIndex]?.videoId : undefined,
      jobSeekerDtoList: { seekerId: jobSeekerId },
      jobSeekerProfileDtoList: { jobseekerProfileId: profileId },
      subject: videoForm.subject,
      videoLink: youtubeId,
    };

    if (editIndex !== null && videoData[editIndex]?.videoId) {
      await updateVideo(videoPayload, headers);
    } else {
      await createVideo(videoPayload, headers);
    }
  };

  const handleDelete = async (section, index) => {
    try {
      const profileId = sessionStorage.getItem("jobseekerProfileId");
      
      switch (section) {
        case 'employment':
          await deleteExperience(employmentData[index].experienceId, headers);
          break;
        case 'currentEmployment':
          await deleteEmployment(currentEmploymentData.employmentId, headers);
          setCurrentEmploymentData(null);
          setCanAddCurrentEmployment(true);
          break;
        case 'education':
          await deleteEducation(educationData[index].educationId, headers);
          break;
        case 'experience':
          await deleteExperience(experienceData[index].experienceId, headers);
          break;
        case 'skills':
          await deleteSkill(skillsData[index].skillId, headers);
          break;
        case 'projects':
          await deleteProject(projectsData[index].projectId, headers);
          break;
        case 'certifications':
          await deleteCertificate(certificationsData[index].certificateId, headers);
          break;
        case 'languages':
          await deleteLanguage(languagesData[index].languageId, headers);
          break;
        case 'courses':
          await deleteCourse(coursesData[index].courseId, headers);
          break;
        case 'contactInfo':
          await deleteSocialMedia(contactInfoData[index].socialMediaId, headers);
          break;
        case 'awards':
          await deleteAwards(awardsData[index].awardId, headers);
          break;
        case 'video':
          await deleteVideo(videoData.videoId, headers);
          break;
      }
      
      // Refresh the specific section data
      await refreshSectionData(section);
      
      Swal.fire("Success", "Item deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting item:", error);
      Swal.fire("Error", "Failed to delete item", "error");
    }
  };

  const uploadFile = async (file) => {
    const data = new FormData();
    data.append("file", file);
    const response = await axios.post(`${BaseUrl}/file/uploadFile`, data, {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + user.accessToken,
      },
    });
    if (response.data.responseCode === 201 && response.data.status === "SUCCESS") {
      return response.data.fileName;
    } else {
      throw new Error("File upload failed");
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");
      const fileName = await uploadFile(file);
      const payload = {
        jobseekerProfileId,
        jobseekerProfileCoverPicName: fileName,
        jobSeekerDto: { seekerId: parseInt(user?.seekerId) },
      };
      await saveOrUpdateJobSeekerProfileCoverPic(payload, headers);
      setCoverImage(`${BaseUrl}/file/downloadFile?filePath=${fileName}`);
      Swal.fire("Success", "Cover image uploaded successfully", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const jobseekerProfileId = sessionStorage.getItem("jobseekerProfileId");
      const fileName = await uploadFile(file);
      const payload = {
        jobseekerProfileId,
        jobseekerProfilePicName: fileName,
        jobSeekerDto: { seekerId: parseInt(user?.seekerId) },
      };
      await saveOrUpdateJobSeekerProfilePic(payload, headers);
      setProfileImage(`${BaseUrl}/file/downloadFile?filePath=${fileName}`);
      Swal.fire("Success", "Profile image uploaded successfully", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEmailClick = () => {
    if (profileData.email) {
      window.open(`mailto:${profileData.email}`, '_blank');
    }
  };

  const handlePortfolioClick = () => {
    if (profileData.website) {
      window.open(profileData.website, '_blank');
    }
  };

  const handleGithubClick = () => {
    const githubLink = contactInfoData?.find(social => 
      social.socialmediaName?.toLowerCase().includes('github')
    )?.socialmediaLink;
    
    if (githubLink) {
      window.open(githubLink, '_blank');
    } else {
      console.log("No GitHub link found in social media");
    }
  };

  const handleLinkedInClick = () => {
    if (profileData.linkedin) {
      window.open(profileData.linkedin, '_blank');
    }
  };

  const handleButtonClick = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const validateFields = () => {
    const newErrors = {};
    let isValid = true;
    
    if (aboutEditSection === "about") {
      if (!profileData.description.trim()) {
        newErrors.description = "Description is required";
        isValid = false;
      } else if (profileData.description.trim().length > 200) {
        newErrors.description = "Description must be less than 200 characters";
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleEdit = (section) => {
    setAboutEditSection(section);
    setOpenEditDialog(true);
    setErrors({});
  };

  const handleSave = async () => {
    const validationResult = validateFields();
    
    if (!validationResult) {
      return;
    }
    
    const jobSeekerId = parseInt(user?.seekerId);
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
    
    Swal.fire({ 
      title: isProfileCreated ? "Updating..." : "Saving...", 
      allowOutsideClick: false, 
      didOpen: () => Swal.showLoading() 
    });
    
    try {
      const endpoint = isProfileCreated 
        ? `${BaseUrl}/jobseekerprofile/v1/updateJobSeekerProfile`
        : `${BaseUrl}/jobseekerprofile/v1/createJobSeekerProfile`;
      
      const response = isProfileCreated
        ? await axios.put(endpoint, requestData, { headers })
        : await axios.post(endpoint, requestData, { headers });
      
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
      Swal.fire({ 
        icon: "error", 
        title: "Error", 
        text: error.response?.data?.message || "Failed to save profile" 
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onEdit({ ...profileData, [name]: value });
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

  // Function to render section content
  const renderSectionContent = (section) => {
    if (section.loading) {
      return (
        <Typography variant="body2" sx={{ 
          color: '#666', 
          fontSize: '14px',
          fontStyle: 'italic',
          textAlign: 'center',
          py: 2
        }}>
          Loading...
        </Typography>
      );
    }

    if (!section.data || section.data.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" sx={{ 
            color: '#666', 
            fontSize: '14px',
            fontStyle: 'italic',
            mb: 2
          }}>
            No {section.label.toLowerCase()} added yet
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => handleEditOpen(section.id)}
            sx={{
              color: '#0095a5',
              borderColor: '#0095a5',
              '&:hover': { borderColor: '#0095a5', backgroundColor: 'rgba(0, 149, 165, 0.04)' }
            }}
          >
            Add {section.label.slice(0, -1)}
          </Button>
        </Box>
      );
    }

    // Render different content based on section type
    switch (section.id) {
      case 'currentEmployment':
        return (
          <Box>
            {section.data.map((emp, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                    {emp.jobTitle} at {emp.companyName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditOpen('currentEmployment', index)} sx={{ 
                        background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                        color: 'white',
                        '&:hover': { background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)" }
                      }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete('currentEmployment', index)} sx={{ color: '#dc3545' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '14px', mb: 0.5 }}>
                  <strong>Type:</strong> {emp.employmentType}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '14px', mb: 0.5 }}>
                  <strong>CTC:</strong> {emp.currentctc}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '14px', mb: 0.5 }}>
                  <strong>Notice Period:</strong> {emp.noticePeriod}
                </Typography>
                {emp.skill && (
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '14px', mb: 0.5 }}>
                    <strong>Skills:</strong> {emp.skill}
                  </Typography>
                )}
                {emp.jobDescription && (
                  <Typography variant="body2" sx={{ fontSize: '14px', mt: 1 }}>
                    {emp.jobDescription}
                  </Typography>
                )}
              </Box>
            ))}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleEditOpen('currentEmployment')}
                disabled={!canAddCurrentEmployment}
                sx={{
                  background: canAddCurrentEmployment ? "linear-gradient(90deg, #006D77 0%, #0195A3 100%)" : "#ccc",
                  color: 'white',
                  border: 'none',
                  '&:hover': { 
                    background: canAddCurrentEmployment ? "linear-gradient(90deg, #005a61 0%, #017a87 100%)" : "#ccc",
                  }
                }}
              >
                Add Current Employment
              </Button>
            </Box>
          </Box>
        );

      case 'experience':
        return (
          <Box>
            {section.data.map((exp, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                    {exp.designation} at {exp.companyName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditOpen('experience', index)} sx={{ 
                        background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                        color: 'white',
                        '&:hover': { background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)" }
                      }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete('experience', index)} sx={{ color: '#dc3545' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                  <strong>Duration:</strong> {exp.fromDate && exp.toDate ? 
                    `${new Date(exp.fromDate).toLocaleDateString()} - ${new Date(exp.toDate).toLocaleDateString()}` : 
                    'Date not specified'
                  }
                </Typography>
                {exp.description && (
                  <Typography variant="body2" sx={{ mt: 1, fontSize: '14px' }}>
                    {exp.description}
                  </Typography>
                )}
              </Box>
            ))}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleEditOpen('experience')}
                sx={{
                  background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                  color: 'white',
                  border: 'none',
                  '&:hover': { 
                    background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
                  }
                }}
              >
                Add Experience
              </Button>
            </Box>
          </Box>
        );

      case 'education':
        return (
          <Box>
            {section.data.map((edu, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                    {edu.educationName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditOpen('education', index)} sx={{ 
                        background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                        color: 'white',
                        '&:hover': { background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)" }
                      }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete('education', index)} sx={{ color: '#dc3545' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                  <strong>Institution:</strong> {edu.instituteName} • <strong>Percentage:</strong> {edu.percentage}%
                </Typography>
                {edu.description && (
                  <Typography variant="body2" sx={{ mt: 1, fontSize: '14px' }}>
                    {edu.description}
                  </Typography>
                )}
              </Box>
            ))}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleEditOpen('education')}
                sx={{
                  background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                  color: 'white',
                  border: 'none',
                  '&:hover': { 
                    background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
                  }
                }}
              >
                Add Education
              </Button>
            </Box>
          </Box>
        );

      case 'skills':
        return (
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {section.data.map((skill, index) => (
                <Box key={index} sx={{ 
                  backgroundColor: '#e3f2fd', 
                  color: '#1976d2', 
                  px: 2, 
                  py: 1, 
                  borderRadius: 2,
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  {skill.skillName}
                  <IconButton size="small" onClick={() => handleEditOpen('skills', index)} sx={{ 
                    background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                    color: 'white',
                    p: 0.5,
                    '&:hover': { background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)" }
                  }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete('skills', index)} sx={{ color: '#dc3545', p: 0.5 }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleEditOpen('skills')}
                sx={{
                  background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                  color: 'white',
                  border: 'none',
                  '&:hover': { 
                    background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
                  }
                }}
              >
                Add Skill
              </Button>
            </Box>
          </Box>
        );

      case 'projects':
        return (
          <Box>
            {section.data.map((project, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                    {project.projectName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditOpen('projects', index)} sx={{ 
                        background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                        color: 'white',
                        '&:hover': { background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)" }
                      }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete('projects', index)} sx={{ color: '#dc3545' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '14px', mb: 1 }}>
                  <strong>Skills Used:</strong> {project.skill}
                </Typography>
                {project.description && (
                  <Typography variant="body2" sx={{ fontSize: '14px', mb: 1 }}>
                    {project.description}
                  </Typography>
                )}
                {project.projectUrl && (
                  <Typography variant="body2" sx={{ fontSize: '14px' }}>
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0095a5' }}>
                      View Project
                    </a>
                  </Typography>
                )}
              </Box>
            ))}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleEditOpen('projects')}
                sx={{
                  background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                  color: 'white',
                  border: 'none',
                  '&:hover': { 
                    background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
                  }
                }}
              >
                Add Project
              </Button>
            </Box>
          </Box>
        );

      case 'certifications':
        return (
          <Box>
            {section.data.map((cert, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                    {cert.certificateName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditOpen('certifications', index)} sx={{ 
                        background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                        color: 'white',
                        '&:hover': { background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)" }
                      }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete('certifications', index)} sx={{ color: '#dc3545' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            ))}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleEditOpen('certifications')}
                sx={{
                  background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                  color: 'white',
                  border: 'none',
                  '&:hover': { 
                    background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
                  }
                }}
              >
                Add Certification
              </Button>
            </Box>
          </Box>
        );

      case 'languages':
        return (
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {section.data.map((lang, index) => (
                <Box key={index} sx={{ 
                  backgroundColor: '#e8f5e8', 
                  color: '#2e7d32', 
                  px: 2, 
                  py: 1, 
                  borderRadius: 2,
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  {lang.languageName}
                  <IconButton size="small" onClick={() => handleEditOpen('languages', index)} sx={{ 
                    background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                    color: 'white',
                    p: 0.5,
                    '&:hover': { background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)" }
                  }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete('languages', index)} sx={{ color: '#dc3545', p: 0.5 }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleEditOpen('languages')}
                sx={{
                  background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                  color: 'white',
                  border: 'none',
                  '&:hover': { 
                    background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
                  }
                }}
              >
                Add Language
              </Button>
            </Box>
          </Box>
        );

      case 'courses':
        return (
          <Box>
            {section.data.map((course, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                    {course.courseName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditOpen('courses', index)} sx={{ 
                        background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                        color: 'white',
                        '&:hover': { background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)" }
                      }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete('courses', index)} sx={{ color: '#dc3545' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                {course.description && (
                  <Typography variant="body2" sx={{ fontSize: '14px' }}>
                    {course.description}
                  </Typography>
                )}
              </Box>
            ))}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleEditOpen('courses')}
                sx={{
                  background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                  color: 'white',
                  border: 'none',
                  '&:hover': { 
                    background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
                  }
                }}
              >
                Add Course
              </Button>
            </Box>
          </Box>
        );

      case 'contactInfo':
        return (
          <Box>
            {section.data.map((link, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                    {link.socialmediaName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditOpen('contactInfo', index)} sx={{ 
                        background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                        color: 'white',
                        '&:hover': { background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)" }
                      }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete('contactInfo', index)} sx={{ color: '#dc3545' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ fontSize: '14px' }}>
                  <strong>Link:</strong> <a href={link.socialmediaLink} target="_blank" rel="noopener noreferrer" style={{ color: '#0095a5' }}>
                    {link.socialmediaLink}
                  </a>
                </Typography>
              </Box>
            ))}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleEditOpen('contactInfo')}
                sx={{
                  background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                  color: 'white',
                  border: 'none',
                  '&:hover': { 
                    background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
                  }
                }}
              >
                Add Social Link
              </Button>
            </Box>
          </Box>
        );

      case 'awards':
        return (
          <Box>
            {section.data.map((award, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                    {award.awardName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditOpen('awards', index)} sx={{ 
                        background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                        color: 'white',
                        '&:hover': { background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)" }
                      }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete('awards', index)} sx={{ color: '#dc3545' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
            ))}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleEditOpen('awards')}
                sx={{
                  background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                  color: 'white',
                  border: 'none',
                  '&:hover': { 
                    background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
                  }
                }}
              >
                Add Award
              </Button>
            </Box>
          </Box>
        );

      case 'video':
        return (
          <Box>
            {section.data && section.data.length > 0 ? (
              section.data.map((video, index) => {
                const youtubeId = getYouTubeId(video.videoLink);
                const embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
                
                return (
                  <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, border: '1px solid #e9ecef' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                        {video.subject}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEditOpen('video', index)} sx={{ 
                            background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                            color: 'white',
                            '&:hover': { background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)" }
                          }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete('video', index)} sx={{ color: '#dc3545' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    {video.videoLink && (
                      <Box
                        sx={{
                          position: "relative",
                          paddingBottom: "56.25%",
                          height: 0,
                          overflow: "hidden",
                          borderRadius: 1,
                          boxShadow: 1,
                          mb: 1,
                        }}
                      >
                        <iframe
                          src={embedUrl}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: "none",
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`Embedded video ${index}`}
                        />
                      </Box>
                    )}
                  </Box>
                );
              })
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" sx={{ 
                  color: '#666', 
                  fontSize: '14px',
                  fontStyle: 'italic',
                  mb: 2
                }}>
                  No video added yet
                </Typography>
              </Box>
            )}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleEditOpen('video')}
                sx={{
                  background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                  color: 'white',
                  border: 'none',
                  '&:hover': { 
                    background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
                  }
                }}
              >
                Add Video
              </Button>
            </Box>
          </Box>
        );

      default:
        return (
          <Typography variant="body2" sx={{ 
            color: '#666', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            {section.label} content will be displayed here when expanded.
          </Typography>
        );
    }
  };

  const sections = [
    { label: "Current Employment", id: "currentEmployment", data: currentEmploymentData ? [currentEmploymentData] : [], loading: loadingStates.currentEmployment },
    { label: "Experience", id: "experience", data: experienceData, loading: loadingStates.experience },
    { label: "Education", id: "education", data: educationData, loading: loadingStates.education },
    { label: "Skills", id: "skills", data: skillsData, loading: loadingStates.skills },
    { label: "Projects", id: "projects", data: projectsData, loading: loadingStates.projects },
    { label: "Certifications", id: "certifications", data: certificationsData, loading: loadingStates.certifications },
    { label: "Languages", id: "languages", data: languagesData, loading: loadingStates.languages },
    { label: "Courses", id: "courses", data: coursesData, loading: loadingStates.courses },
    { label: "Social Links", id: "contactInfo", data: contactInfoData, loading: loadingStates.contactInfo },
    { label: "Awards", id: "awards", data: awardsData, loading: loadingStates.awards },
    { label: "Video", id: "video", data: videoData ? [videoData] : [], loading: loadingStates.video },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Cover Image Section */}
      <Box
        sx={{
          height: "120px",
          backgroundColor: coverImageUrl ? "transparent" : "#f8f6f0",
          backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        {/* Decorative Pattern - Only show when no cover image */}
        {!coverImageUrl && (
          <Box
            sx={{
              position: "absolute",
              left: "20px",
              top: "20px",
              width: "80px",
              height: "80px",
              background: `
                linear-gradient(45deg, #20b2aa, #87ceeb, #98fb98),
                linear-gradient(-45deg, #20b2aa, #87ceeb, #98fb98)
              `,
              borderRadius: "50%",
              opacity: 0.3,
              "&::before": {
                content: '""',
                position: "absolute",
                top: "10px",
                left: "10px",
                width: "60px",
                height: "60px",
                background: "linear-gradient(45deg, #20b2aa, #87ceeb)",
                borderRadius: "50%",
                opacity: 0.5,
              },
            }}
          />
        )}

        {/* Quote Text - Only show when no cover image */}
        {!coverImageUrl && (
          <Box
            sx={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              textAlign: "right",
              maxWidth: "200px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
                lineHeight: 1.2,
                fontFamily: "Arial, sans-serif",
              }}
            >
              It's not faith
              <br />
              in technology.
              <br />
              It's faith
              <br />
              in people.
            </Typography>
          </Box>
        )}

        {/* Website URL - Only show when no cover image */}
        {!coverImageUrl && (
          <Typography
            sx={{
              position: "absolute",
              left: "20px",
              bottom: "20px",
              fontSize: "10px",
              color: "#666",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              fontFamily: "monospace",
            }}
          >
            REALLYGREATSITE.COM
          </Typography>
        )}

        {/* Cover Image Upload Button */}
        <input
          type="file"
          accept="image/*"
          id="cover-image-input"
          style={{ display: "none" }}
          onChange={handleCoverImageChange}
        />
        <label htmlFor="cover-image-input">
          <IconButton
            component="span"
            sx={{
              position: "absolute",
              top: "15px",
              right: "15px",
              backgroundColor: "#0095a5",
              color: "white",
              width: "32px",
              height: "32px",
              "&:hover": { backgroundColor: "#f8a12d", color: "#fff" },
            }}
          >
            <EditIcon sx={{ fontSize: "16px" }} />
          </IconButton>
        </label>
      </Box>

      {/* Main Profile Card */}
      <Box
        sx={{
          position: "relative",
          marginTop: "-50px",
          marginX: "10px",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "20px 20px 15px 20px",
          boxShadow: "0px 0px 4px 0px #00000040",
          zIndex: 2,
          minHeight: "auto",
          width: "calc(100% - 20px)",
        }}
      >
        {/* Edit Button */}
        <IconButton
          sx={{
            position: "absolute",
            top: "15px",
            right: "15px",
            backgroundColor: "transparent",
            color: "#333",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.05)",
            },
          }}
          onClick={() => onEdit("personal")}
        >
          <EditIcon sx={{ fontSize: "20px" }} />
        </IconButton>

        {/* Profile Image */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "15px",
          }}
        >
          <Box
            sx={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "4px solid white",
              marginTop: "-60px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#666",
                  textAlign: "center",
                }}
              >
                Profile
                <br />
                Image
              </Typography>
            )}

            {/* Profile Image Upload Button */}
            <input
              type="file"
              accept="image/*"
              id="profile-image-input"
              style={{ display: "none" }}
              onChange={handleProfileImageChange}
            />
            <label htmlFor="profile-image-input">
              <IconButton
                component="span"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#0095a5",
                  color: "white",
                  width: "28px",
                  height: "28px",
                  "&:hover": { backgroundColor: "#f8a12d", color: "#fff" },
                }}
              >
                <CameraAltIcon sx={{ fontSize: "14px" }} />
              </IconButton>
            </label>
          </Box>
        </Box>

        {/* Name */}
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "6px",
            fontSize: "24px",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.2,
          }}
        >
          {profileData.jobseekerProfileName || "Ganesh"}
        </Typography>

        {/* Designation */}
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#666",
            marginBottom: "15px",
            fontSize: "14px",
            fontWeight: "normal",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.3,
          }}
        >
          {profileData.designation || "Java Full Stack developer"}
        </Typography>

        {/* Contact Information */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <LocationOnIcon sx={{ fontSize: "14px", color: "#0095a5" }} />
            <Typography
              sx={{
                fontSize: "13px",
                color: "#333",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {profileData.location || "Bengaluru, India"}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <PhoneIcon sx={{ fontSize: "14px", color: "#0095a5" }} />
            <Typography
              sx={{
                fontSize: "13px",
                color: "#333",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {profileData.mobileNumber || "+91 767676787"}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: "4px",
            justifyContent: "center",
            padding: "0 5px",
            flexWrap: "nowrap",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={handleEmailClick}
            sx={{
              background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
              color: "white",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "11px",
              fontWeight: "normal",
              width: "60px",
              height: "24px",
              minWidth: "60px",
              maxWidth: "60px",
              padding: "0",
              "&:hover": {
                background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
              },
            }}
          >
            Email
          </Button>
          <Button
            variant="contained"
            onClick={handlePortfolioClick}
            sx={{
              background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
              color: "white",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "11px",
              fontWeight: "normal",
              width: "60px",
              height: "24px",
              minWidth: "60px",
              maxWidth: "60px",
              padding: "0",
              "&:hover": {
                background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
              },
            }}
          >
            Portfolio
          </Button>
          <Button
            variant="contained"
            onClick={handleGithubClick}
            sx={{
              background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
              color: "white",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "11px",
              fontWeight: "normal",
              width: "60px",
              height: "24px",
              minWidth: "60px",
              maxWidth: "60px",
              padding: "0",
              "&:hover": {
                background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
              },
            }}
          >
            Github
          </Button>
          <Button
            variant="contained"
            onClick={handleLinkedInClick}
            sx={{
              background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
              color: "white",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "11px",
              fontWeight: "normal",
              width: "60px",
              height: "24px",
              minWidth: "60px",
              maxWidth: "60px",
              padding: "0",
              "&:hover": {
                background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
              },
            }}
          >
            LinkedIn
          </Button>
        </Box>
      </Box>

      {/* About Section */}
      <Box
        sx={{
          marginX: "10px",
          marginTop: "20px",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0px 0px 4px 0px #00000040",
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ 
            background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 500,
            fontFamily: 'Roboto',
            fontSize: '18px',
            lineHeight: '124%',
            letterSpacing: '1%',
          }}>
            About
          </Typography>
          <IconButton 
            size="small" 
            sx={{ 
              background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
              color: 'white',
              '&:hover': {
                background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
              }
            }}
            onClick={() => handleEdit('about')}
          >
            <EditIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" sx={{ 
          color: '#666', 
          lineHeight: 1.6, 
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif'
        }}>
          {profileData.description || "Skilled front-end developer creating visually stunning, user-friendly websites and apps, applying UI/UX principles to deliver high-quality products that exceed client expectations."}
        </Typography>
      </Box>

      {/* Collapsible Sections */}
      <Box
        sx={{
          marginX: "10px",
          marginTop: "20px",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "10px",
          // boxShadow: "0px 0px 4px 0px #00000040",
        }}
      >
        {sections.map((section, index) => (
          <Box key={section.id}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ 
                background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 500,
                fontFamily: 'Roboto',
                fontSize: '16px',
                lineHeight: '124%',
                letterSpacing: '1%',
              }}>
                {section.label}
              </Typography>
              <IconButton 
                size="small" 
                sx={{ 
                  background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
                  color: 'white',
                  transform: activeSection === section.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
                  }
                }}
                onClick={() => handleButtonClick(section.id)}
              >
                <KeyboardArrowDownIcon sx={{ fontSize: "20px" }} />
              </IconButton>
            </Box>
            <Collapse in={activeSection === section.id}>
              <Box sx={{ mt: 1, mb: 1 }}>
                {renderSectionContent(section)}
              </Box>
            </Collapse>
            {index < sections.length - 1 && (
              <Divider sx={{ my: 0.5 }} />
            )}
          </Box>
        ))}
      </Box>

      {/* Preview and Print PDF Buttons */}
      <Box
        sx={{
          marginX: "10px",
          marginTop: "20px",
          marginBottom: "20px",
          display: 'flex', 
          gap: 2, 
          flexDirection: 'row'
        }}
      >
        <Button
          variant="outlined"
          onClick={handlePrintPreview}
          sx={{
            borderColor: '#0095a5',
            color: '#0095a5',
            borderRadius: 2,
            textTransform: 'none',
            py: 1,
            px: 2,
            flex: 1,
            fontSize: '12px',
            fontWeight: 'normal',
            minHeight: '36px',
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
            background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
            color: 'white',
            borderRadius: 2,
            textTransform: 'none',
            py: 1,
            px: 2,
            flex: 1,
            fontSize: '12px',
            fontWeight: 'normal',
            minHeight: '36px',
            '&:hover': {
              background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
            }
          }}
        >
          Print PDF
        </Button>
      </Box>

      {/* Edit Dialog for About Section */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {aboutEditSection === 'about' ? 'Edit About' : 'Edit Section'}
        </DialogTitle>
        <DialogContent>
          {aboutEditSection === 'about' ? (
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
          ) : null}
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

      {/* Comprehensive Edit Dialog for All Sections */}
      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editIndex !== null ? `Edit ${editSection}` : `Add ${editSection}`}
        </DialogTitle>
        <DialogContent>
          {editLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              {editSection === 'employment' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      value={employmentForm.jobTitle}
                      onChange={(e) => setEmploymentForm({...employmentForm, jobTitle: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      value={employmentForm.companyName}
                      onChange={(e) => setEmploymentForm({...employmentForm, companyName: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Employment Type</InputLabel>
                      <Select
                        value={employmentForm.employmentType}
                        onChange={(e) => setEmploymentForm({...employmentForm, employmentType: e.target.value})}
                      >
                        <MenuItem value="Full-time">Full-time</MenuItem>
                        <MenuItem value="Part-time">Part-time</MenuItem>
                        <MenuItem value="Contract">Contract</MenuItem>
                        <MenuItem value="Internship">Internship</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Current CTC"
                      value={employmentForm.currentctc}
                      onChange={(e) => setEmploymentForm({...employmentForm, currentctc: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Skills"
                      value={employmentForm.skill}
                      onChange={(e) => setEmploymentForm({...employmentForm, skill: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Job Description"
                      value={employmentForm.jobDescription}
                      onChange={(e) => setEmploymentForm({...employmentForm, jobDescription: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notice Period"
                      value={employmentForm.noticePeriod}
                      onChange={(e) => setEmploymentForm({...employmentForm, noticePeriod: e.target.value})}
                    />
                  </Grid>
                </Grid>
              )}

              {editSection === 'education' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Education Name"
                      value={educationForm.educationName}
                      onChange={(e) => setEducationForm({...educationForm, educationName: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Institution Name"
                      value={educationForm.institutionName}
                      onChange={(e) => setEducationForm({...educationForm, institutionName: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Percentage"
                      type="number"
                      value={educationForm.percentage}
                      onChange={(e) => setEducationForm({...educationForm, percentage: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      value={educationForm.startDate}
                      onChange={(e) => setEducationForm({...educationForm, startDate: e.target.value})}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      value={educationForm.endDate}
                      onChange={(e) => setEducationForm({...educationForm, endDate: e.target.value})}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={educationForm.description}
                      onChange={(e) => setEducationForm({...educationForm, description: e.target.value})}
                    />
                  </Grid>
                </Grid>
              )}

              {editSection === 'experience' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      value={experienceForm.companyName}
                      onChange={(e) => setExperienceForm({...experienceForm, companyName: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Designation"
                      value={experienceForm.designation}
                      onChange={(e) => setExperienceForm({...experienceForm, designation: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      value={experienceForm.startDate}
                      onChange={(e) => setExperienceForm({...experienceForm, startDate: e.target.value})}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      value={experienceForm.endDate}
                      onChange={(e) => setExperienceForm({...experienceForm, endDate: e.target.value})}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={experienceForm.description}
                      onChange={(e) => setExperienceForm({...experienceForm, description: e.target.value})}
                    />
                  </Grid>
                </Grid>
              )}

              {editSection === 'skills' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Skill Name"
                      value={skillForm.skillName}
                      onChange={(e) => setSkillForm({...skillForm, skillName: e.target.value})}
                    />
                  </Grid>
                </Grid>
              )}

              {editSection === 'projects' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Project Name"
                      value={projectForm.projectName}
                      onChange={(e) => setProjectForm({...projectForm, projectName: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Skills Used"
                      value={projectForm.skill}
                      onChange={(e) => setProjectForm({...projectForm, skill: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Project URL"
                      value={projectForm.projectUrl}
                      onChange={(e) => setProjectForm({...projectForm, projectUrl: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    />
                  </Grid>
                </Grid>
              )}

              {editSection === 'certifications' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Certificate Name"
                      value={certificationForm.certificateName}
                      onChange={(e) => setCertificationForm({...certificationForm, certificateName: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="File Name"
                      value={certificationForm.fileName}
                      onChange={(e) => setCertificationForm({...certificationForm, fileName: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const fileName = await uploadFile(file);
                            setCertificationForm({...certificationForm, fileName: fileName});
                          } catch (error) {
                            Swal.fire("Error", "Failed to upload file", "error");
                          }
                        }
                      }}
                      style={{ display: 'none' }}
                      id="certification-file-upload"
                    />
                    <label htmlFor="certification-file-upload">
                      <Button variant="outlined" component="span" fullWidth>
                        Upload Certificate File
                      </Button>
                    </label>
                  </Grid>
                </Grid>
              )}

              {editSection === 'languages' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Language Name"
                      value={languageForm.languageName}
                      onChange={(e) => setLanguageForm({...languageForm, languageName: e.target.value})}
                    />
                  </Grid>
                </Grid>
              )}

              {editSection === 'courses' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Course Name"
                      value={courseForm.courseName}
                      onChange={(e) => setCourseForm({...courseForm, courseName: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                    />
                  </Grid>
                </Grid>
              )}

              {editSection === 'contactInfo' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Social Media Name"
                      value={contactForm.socialmediaName}
                      onChange={(e) => setContactForm({...contactForm, socialmediaName: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Social Media Link"
                      value={contactForm.socialmediaLink}
                      onChange={(e) => setContactForm({...contactForm, socialmediaLink: e.target.value})}
                    />
                  </Grid>
                </Grid>
              )}

              {editSection === 'awards' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Award Name"
                      value={awardForm.awardName}
                      onChange={(e) => setAwardForm({...awardForm, awardName: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="File Name"
                      value={awardForm.fileName}
                      onChange={(e) => setAwardForm({...awardForm, fileName: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const fileName = await uploadFile(file);
                            setAwardForm({...awardForm, fileName: fileName});
                          } catch (error) {
                            Swal.fire("Error", "Failed to upload file", "error");
                          }
                        }
                      }}
                      style={{ display: 'none' }}
                      id="award-file-upload"
                    />
                    <label htmlFor="award-file-upload">
                      <Button variant="outlined" component="span" fullWidth>
                        Upload Award File
                      </Button>
                    </label>
                  </Grid>
                </Grid>
              )}

              {editSection === 'currentEmployment' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      value={currentEmploymentForm.jobTitle}
                      onChange={(e) => setCurrentEmploymentForm({...currentEmploymentForm, jobTitle: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      value={currentEmploymentForm.companyName}
                      onChange={(e) => setCurrentEmploymentForm({...currentEmploymentForm, companyName: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Employment Type</InputLabel>
                      <Select
                        value={currentEmploymentForm.employmentType}
                        onChange={(e) => setCurrentEmploymentForm({...currentEmploymentForm, employmentType: e.target.value})}
                      >
                        <MenuItem value="Full-time">Full-time</MenuItem>
                        <MenuItem value="Part-time">Part-time</MenuItem>
                        <MenuItem value="Contract">Contract</MenuItem>
                        <MenuItem value="Internship">Internship</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Current CTC"
                      value={currentEmploymentForm.currentctc}
                      onChange={(e) => setCurrentEmploymentForm({...currentEmploymentForm, currentctc: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Skills"
                      value={currentEmploymentForm.skill}
                      onChange={(e) => setCurrentEmploymentForm({...currentEmploymentForm, skill: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Job Description"
                      value={currentEmploymentForm.jobDescription}
                      onChange={(e) => setCurrentEmploymentForm({...currentEmploymentForm, jobDescription: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notice Period"
                      value={currentEmploymentForm.noticePeriod}
                      onChange={(e) => setCurrentEmploymentForm({...currentEmploymentForm, noticePeriod: e.target.value})}
                    />
                  </Grid>
                </Grid>
              )}

              {editSection === 'video' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      value={videoForm.subject}
                      onChange={(e) => setVideoForm({...videoForm, subject: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="YouTube Video URL"
                      value={videoForm.videoLink}
                      onChange={(e) => setVideoForm({...videoForm, videoLink: e.target.value})}
                      helperText="Paste a YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
                      required
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} sx={{ color: "#0095a5" }}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            disabled={editLoading}
            sx={{ backgroundColor: "#0095a5", color: "white" }}
          >
            {editLoading ? <CircularProgress size={20} /> : (editIndex !== null ? "Update" : "Add")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MobileProfileCard;
