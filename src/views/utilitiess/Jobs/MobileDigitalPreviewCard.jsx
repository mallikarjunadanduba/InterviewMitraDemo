import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Button,
  Divider,
  Grid,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PersonIcon from "@mui/icons-material/Person";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import SchoolIcon from "@mui/icons-material/School";
import CodeIcon from "@mui/icons-material/Code";
import CertificateIcon from "@mui/icons-material/CardMembership";
import SocialIcon from "@mui/icons-material/Share";
import CourseIcon from "@mui/icons-material/MenuBook";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AuthImage from 'ImageUrlExtracter/AuthImage';
import useSecureImage from "hooks/useSecureImage";
import axios from "axios";
import { BaseUrl } from "BaseUrl";

// ReadMore component for truncated text
const ReadMore = ({ text, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || text.length <= maxLength) {
    return <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6, fontSize: '14px', fontWeight: 'bold' }}>{text}</Typography>;
  }

  const truncatedText = text.substring(0, maxLength);

  return (
    <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6, fontSize: '14px', fontWeight: 'bold' }}>
      {isExpanded ? text : truncatedText}
      {!isExpanded && '...'}
      <Button
        variant="text"
        size="small"
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          color: '#0095a5',
          textTransform: 'none',
          fontSize: '12px',
          minWidth: 'auto',
          p: 0,
          ml: 0.5,
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline'
          }
        }}
      >
        {isExpanded ? 'read less' : 'read more'}
      </Button>
    </Typography>
  );
};

const MobileDigitalPreviewCard = ({ resumeData, profileData }) => {
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [openShareDialog, setOpenShareDialog] = useState(false);

  const user = JSON.parse(sessionStorage.getItem('user'));
  const profileImageUrl = useSecureImage(profileImage, user?.accessToken);
  const coverImageUrl = useSecureImage(coverImage, user?.accessToken);
  
  const profileId = sessionStorage.getItem('jobseekerProfileId');
  const shareableUrl = `${window.location.origin}/profile/share/${profileId}`;

  const handleOpenShareDialog = () => setOpenShareDialog(true);
  const handleCloseShareDialog = () => setOpenShareDialog(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareableUrl);
    alert("Link copied to clipboard!");
  };

  const handleBackClick = () => {
    // Navigate back to the previous page
    window.history.back();
  };

  // Fetch profile and cover images
  useEffect(() => {
    const fetchImages = async () => {
      if (!user?.accessToken) return;
      
      try {
        const headers = {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + user.accessToken
        };
        
        const jobSeekerId = parseInt(user?.seekerId);
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
        console.error("Error fetching profile images:", error);
      }
    };

    fetchImages();
  }, [user?.accessToken, user?.seekerId]);


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
    const githubLink = resumeData?.socialMedia?.find(social => 
      social.socialmediaName?.toLowerCase().includes('github')
    )?.socialmediaLink;
    if (githubLink) {
      window.open(githubLink, '_blank');
    }
  };

  const handleLinkedInClick = () => {
    if (profileData.linkedin) {
      window.open(profileData.linkedin, '_blank');
    }
  };


  if (!resumeData || !profileData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Loading digital preview...
        </Typography>
      </Box>
    );
  }

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
        {/* Profile Image Placeholder */}
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
          {profileData.jobseekerProfileName || "Name"}
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
          {profileData.designation || "Designation"}
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
              {profileData.location || "Location"}
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
              {profileData.mobileNumber || "Phone"}
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
        }}
      >
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
          mb: 2
        }}>
          About
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" sx={{ 
          color: '#666', 
          lineHeight: 1.6, 
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <ReadMore text={profileData.description || "Professional with extensive experience in the field."} maxLength={150} />
        </Typography>
      </Box>

      {/* Employment Section */}
      {resumeData?.currentEmployment && (
        <Box
          sx={{
            marginX: "10px",
            marginTop: "20px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WorkHistoryIcon sx={{ color: '#0095a5', mr: 1 }} />
            <Typography variant="h6" sx={{
              color: '#0095a5',
              fontWeight: 500,
              fontFamily: 'Roboto',
              fontStyle: 'Medium',
              fontSize: '18px',
              lineHeight: '124%',
              letterSpacing: '1%',
              verticalAlign: 'middle'
            }}>
              Employment
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Company :</Typography>
              <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                {resumeData.currentEmployment.companyName || "Company Name"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Job Title :</Typography>
              <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                {resumeData.currentEmployment.jobTitle || "Job Title"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Employment Type :</Typography>
              <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                {resumeData.currentEmployment.employmentType || "Employment Type"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Skills :</Typography>
              <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                {resumeData.currentEmployment.skill || "Skills"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Current CTC :</Typography>
              <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                {resumeData.currentEmployment.currentctc || "Current CTC"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Notice Period :</Typography>
              <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                {resumeData.currentEmployment.noticePeriod || "Notice Period"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold', mb: 1 }}>Job Description :</Typography>
              <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                {resumeData.currentEmployment.jobDescription || "Job Description"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <input type="checkbox" checked readOnly style={{ margin: 0 }} />
                <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                  Currently working here
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Education Section */}
      {resumeData?.education?.length > 0 && (
        <Box
          sx={{
            marginX: "10px",
            marginTop: "20px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SchoolIcon sx={{ color: '#0095a5', mr: 1 }} />
            <Typography variant="h6" sx={{
              color: '#0095a5',
              fontWeight: 500,
              fontFamily: 'Roboto',
              fontStyle: 'Medium',
              fontSize: '18px',
              lineHeight: '124%',
              letterSpacing: '1%',
              verticalAlign: 'middle'
            }}>
              Education
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          {resumeData.education.map((edu, index) => (
            <Grid container spacing={2} key={index} sx={{ mt: index > 0 ? 2 : 0 }}>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Degree type :</Typography>
                <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                  {edu.educationName || "Degree Type"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>College Name :</Typography>
                <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                  {edu.instituteName || "College Name"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Percentage /CGPA :</Typography>
                <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                  {edu.percentage ? `${edu.percentage}%` : "Percentage/CGPA"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Start year :</Typography>
                <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                  {edu.fromDate ? new Date(edu.fromDate).getFullYear() : "Start Year"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>End year :</Typography>
                <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                  {edu.toDate ? new Date(edu.toDate).getFullYear() : "End Year"}
                </Typography>
              </Grid>
              {edu.description && (
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold', mb: 1 }}>Description :</Typography>
                  <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                    {edu.description}
                  </Typography>
                </Grid>
              )}
            </Grid>
          ))}
        </Box>
      )}

      {/* Work Experience Section */}
      {resumeData?.workExperience?.length > 0 && (
        <Box
          sx={{
            marginX: "10px",
            marginTop: "20px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WorkHistoryIcon sx={{ color: '#0095a5', mr: 1 }} />
            <Typography variant="h6" sx={{
              color: '#0095a5',
              fontWeight: 500,
              fontFamily: 'Roboto',
              fontStyle: 'Medium',
              fontSize: '18px',
              lineHeight: '124%',
              letterSpacing: '1%',
              verticalAlign: 'middle'
            }}>
              Work Experience
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          {resumeData.workExperience.map((exp, index) => (
            <Grid container spacing={2} key={index} sx={{ mt: index > 0 ? 2 : 0 }}>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Designation :</Typography>
                <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                  {exp.designation || "Designation"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Company Name :</Typography>
                <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                  {exp.companyName || "Company Name"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Duration :</Typography>
                <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                  {exp.fromDate ? new Date(exp.fromDate).getFullYear() : "Start Year"} - {exp.toDate ? new Date(exp.toDate).getFullYear() : "End Year"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Experience Years :</Typography>
                <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                  {exp.experienceYears ? `${exp.experienceYears} Years` : "Experience Years"}
                </Typography>
              </Grid>
              {exp.description && (
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold', mb: 1 }}>Description :</Typography>
                  <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                    <ReadMore text={exp.description} maxLength={100} />
                  </Typography>
                </Grid>
              )}
            </Grid>
          ))}
        </Box>
      )}

      {/* Skills Section */}
      {resumeData?.skills?.length > 0 && (
        <Box
          sx={{
            marginX: "10px",
            marginTop: "20px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CodeIcon sx={{ color: '#0095a5', mr: 1 }} />
            <Typography variant="h6" sx={{
              color: '#0095a5',
              fontWeight: 500,
              fontFamily: 'Roboto',
              fontStyle: 'Medium',
              fontSize: '18px',
              lineHeight: '124%',
              letterSpacing: '1%',
              verticalAlign: 'middle'
            }}>
              Skills
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {resumeData.skills.map((skill, index) => (
              <Box
                key={index}
                sx={{
                  border: '1px solid #0095a5',
                  color: '#0095a5',
                  backgroundColor: 'white',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 'normal'
                }}
              >
                {skill.skillName}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Projects Section */}
      {resumeData?.projects?.length > 0 && (
        <Box
          sx={{
            marginX: "10px",
            marginTop: "20px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LightbulbOutlinedIcon sx={{ color: '#0095a5', mr: 1 }} />
            <Typography variant="h6" sx={{
              color: '#0095a5',
              fontWeight: 500,
              fontFamily: 'Roboto',
              fontStyle: 'Medium',
              fontSize: '18px',
              lineHeight: '124%',
              letterSpacing: '1%',
              verticalAlign: 'middle'
            }}>
              Projects
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          {resumeData.projects.map((project, index) => (
            <Grid container spacing={2} key={index} sx={{ mt: index > 0 ? 2 : 0 }}>
              {/* Left Column */}
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Project Name :</Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                      {project.projectName || "Project Name"}
                    </Typography>
                  </Box>
                  {project.skill && (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Skills :</Typography>
                      <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                        {project.skill}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
              {/* Right Column */}
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {project.projectUrl && (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Project Url :</Typography>
                      <Link href={project.projectUrl} target="_blank" sx={{ color: '#0095a5', textDecoration: 'underline', fontSize: '14px' }}>
                        {project.projectName || "View Project"}
                      </Link>
                    </Box>
                  )}
                  {project.description && (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold', mb: 1 }}>Description :</Typography>
                      <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                        <ReadMore text={project.description} maxLength={100} />
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          ))}
        </Box>
      )}

      {/* Languages Section */}
      {resumeData?.languages?.length > 0 && (
        <Box
          sx={{
            marginX: "10px",
            marginTop: "20px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LanguageIcon sx={{ color: '#0095a5', mr: 1 }} />
            <Typography variant="h6" sx={{
              color: '#0095a5',
              fontWeight: 500,
              fontFamily: 'Roboto',
              fontStyle: 'Medium',
              fontSize: '18px',
              lineHeight: '124%',
              letterSpacing: '1%',
              verticalAlign: 'middle'
            }}>
              Languages
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {resumeData.languages.map((lang, index) => (
              <Box
                key={index}
                sx={{
                  border: '1px solid #0095a5',
                  color: '#0095a5',
                  backgroundColor: 'white',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 'normal'
                }}
              >
                {lang.languageName}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Courses Section */}
      {resumeData?.courses?.length > 0 && (
        <Box
          sx={{
            marginX: "10px",
            marginTop: "20px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CourseIcon sx={{ color: '#0095a5', mr: 1 }} />
            <Typography variant="h6" sx={{
              color: '#0095a5',
              fontWeight: 500,
              fontFamily: 'Roboto',
              fontStyle: 'Medium',
              fontSize: '18px',
              lineHeight: '124%',
              letterSpacing: '1%',
              verticalAlign: 'middle'
            }}>
              Courses
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          {resumeData.courses.map((course, index) => (
            <Grid container spacing={2} key={index} sx={{ mt: index > 0 ? 2 : 0 }}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>Course Name :</Typography>
                <Typography variant="body2" sx={{ color: '#333', fontSize: '14px', mb: 1 }}>
                  {course.courseName || "Course Name"}
                </Typography>
              </Grid>
              {course.description && (
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '12px', fontWeight: 'bold', mb: 1 }}>Description :</Typography>
                  <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                    <ReadMore text={course.description} maxLength={100} />
                  </Typography>
                </Grid>
              )}
            </Grid>
          ))}
        </Box>
      )}

      {/* Social Media Section */}
      {resumeData?.socialMedia?.length > 0 && (
        <Box
          sx={{
            marginX: "10px",
            marginTop: "20px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SocialIcon sx={{ color: '#0095a5', mr: 1 }} />
            <Typography variant="h6" sx={{
              color: '#0095a5',
              fontWeight: 500,
              fontFamily: 'Roboto',
              fontStyle: 'Medium',
              fontSize: '18px',
              lineHeight: '124%',
              letterSpacing: '1%',
              verticalAlign: 'middle'
            }}>
              Social Media
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            {resumeData.socialMedia.map((social, index) => (
              <Link
                key={index}
                href={social.socialmediaLink}
                target="_blank"
                rel="noopener"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  textDecoration: 'none',
                  fontSize: '12px',
                  color: '#0095a5',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <Typography sx={{ fontSize: '12px', fontWeight: 'normal' }}>
                  {social.socialmediaName}
                </Typography>
                <ArrowForwardIcon sx={{ fontSize: '14px', color: '#0095a5' }} />
              </Link>
            ))}
          </Box>
        </Box>
      )}

      {/* Certifications Section */}
      {resumeData?.certificates?.length > 0 && (
        <Box
          sx={{
            marginX: "10px",
            marginTop: "20px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CertificateIcon sx={{ color: '#0095a5', mr: 1 }} />
            <Typography variant="h6" sx={{
              color: '#0095a5',
              fontWeight: 500,
              fontFamily: 'Roboto',
              fontStyle: 'Medium',
              fontSize: '18px',
              lineHeight: '124%',
              letterSpacing: '1%',
              verticalAlign: 'middle'
            }}>
              Certifications
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            {resumeData.certificates.map((cert, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  height: '100%',
                  backgroundColor: '#f8f9fa'
                }}>
                  <Box sx={{
                    width: '100%',
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    marginBottom: '8px'
                  }}>
                    <AuthImage
                      filePath={cert.filePath}
                      alt={cert.certificateName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '4px'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" fontWeight="bold" align="center" sx={{ fontSize: '12px', color: '#333' }}>
                    {cert.certificateName}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Awards Section */}
      {resumeData?.awards?.length > 0 && (
        <Box
          sx={{
            marginX: "10px",
            marginTop: "20px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmojiEventsIcon sx={{ color: '#0095a5', mr: 1 }} />
            <Typography variant="h6" sx={{
              color: '#0095a5',
              fontWeight: 500,
              fontFamily: 'Roboto',
              fontStyle: 'Medium',
              fontSize: '18px',
              lineHeight: '124%',
              letterSpacing: '1%',
              verticalAlign: 'middle'
            }}>
              Awards
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            {resumeData.awards.map((award, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  height: '100%',
                  backgroundColor: '#f8f9fa'
                }}>
                  <Box sx={{
                    width: '100%',
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    marginBottom: '8px'
                  }}>
                    {award.filePath ? (
                      <AuthImage
                        filePath={award.filePath}
                        alt={award.awardName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      <EmojiEventsIcon sx={{ fontSize: 24, color: '#0095a5' }} />
                    )}
                  </Box>
                  <Typography variant="body2" fontWeight="bold" align="center" sx={{ fontSize: '12px', color: '#333' }}>
                    {award.awardName}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Back and Share Profile Buttons */}
      <Box
        sx={{
          marginX: "10px",
          marginTop: "20px",
          marginBottom: "20px",
          display: 'flex', 
          gap: 2, 
          flexDirection: 'row',
          justifyContent: 'flex-start',
          paddingLeft: '20px'
        }}
      >
        <Button
          variant="contained"
          startIcon={<ShareIcon />}
          onClick={handleOpenShareDialog}
          sx={{
            background: "linear-gradient(90deg, #006D77 0%, #0195A3 100%)",
            color: 'white',
            borderRadius: 2,
            textTransform: 'none',
            py: 1,
            px: 2,
            width: 'auto',
            fontSize: '12px',
            fontWeight: 'normal',
            minHeight: '36px',
            '&:hover': {
              background: "linear-gradient(90deg, #005a61 0%, #017a87 100%)",
            }
          }}
        >
          Share Profile
        </Button>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{
            borderColor: '#0095a5',
            color: '#0095a5',
            borderRadius: 2,
            textTransform: 'none',
            py: 1,
            px: 2,
            width: 'auto',
            fontSize: '12px',
            fontWeight: 'normal',
            minHeight: '36px',
            '&:hover': {
              borderColor: '#007a87',
              backgroundColor: 'rgba(0, 149, 165, 0.1)',
            }
          }}
        >
          Back
        </Button>
      </Box>

      {/* Share Dialog */}
      <Dialog open={openShareDialog} onClose={handleCloseShareDialog}>
        <DialogTitle>
          Share Your Profile
          <IconButton onClick={handleCloseShareDialog} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            <IconButton component="a" href={`https://www.facebook.com/sharer/sharer.php?u=${shareableUrl}`} target="_blank">
              <FacebookIcon />
            </IconButton>
            <IconButton component="a" href={`https://twitter.com/intent/tweet?url=${shareableUrl}`} target="_blank">
              <TwitterIcon />
            </IconButton>
            <IconButton component="a" href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareableUrl}`} target="_blank">
              <LinkedInIcon />
            </IconButton>
            <IconButton component="a" href={`https://wa.me/?text=${shareableUrl}`} target="_blank">
              <WhatsAppIcon />
            </IconButton>
            <IconButton component="a" href={`mailto:?subject=Check%20my%20resume&body=${shareableUrl}`}>
              <EmailIcon />
            </IconButton>
            <IconButton onClick={handleCopy}>
              <ContentCopyIcon />
            </IconButton>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MobileDigitalPreviewCard;
