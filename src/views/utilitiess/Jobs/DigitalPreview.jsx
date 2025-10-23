import { useTheme } from '@mui/material/styles';
import {
  Grid, Typography, List, ListItem,
  ListItemText, Box, Chip, Button,
  useMediaQuery, Link, Avatar, Divider,
  Stack, IconButton, Paper, Dialog, DialogTitle, DialogContent,
  Card, CardContent
} from '@mui/material';
import MobileDigitalPreviewCard from './MobileDigitalPreviewCard';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import LanguageIcon from '@mui/icons-material/Language';
import CertificateIcon from '@mui/icons-material/CardMembership';
import SocialIcon from '@mui/icons-material/Share';
import CourseIcon from '@mui/icons-material/MenuBook';
import { useReactToPrint } from 'react-to-print';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';
import Basic_Details from './Basic_Details';
import BadgeIcon from '@mui/icons-material/Badge';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ShareIcon from '@mui/icons-material/Share';
import AuthImage from 'ImageUrlExtracter/AuthImage';
import CloseIcon from '@mui/icons-material/Close';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';
import MainCard from 'ui-component/cards/MainCard';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

// ReadMore component for truncated text
const ReadMore = ({ text, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || text.length <= maxLength) {
    return <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6, fontSize: '16px', fontWeight: 'bold' }}>{text}</Typography>;
  }

  const truncatedText = text.substring(0, maxLength);

  return (
    <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6, fontSize: '16px', fontWeight: 'bold' }}>
      {isExpanded ? text : truncatedText}
      {!isExpanded && '...'}
      <Button
        variant="text"
        size="small"
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          color: '#0095a5',
          textTransform: 'none',
          fontSize: '14px',
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

const DigitalPreview = () => {
  const theme = useTheme();
  const resumeRef = useRef();
  const [resumeData, setResumeData] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [profileData, setProfileData] = useState({
    jobseekerProfileName: "",
    description: "",
    email: "",
    mobileNumber: "",
    designation: "",
    location: "",
    linkedin: "",
    website: ""
  });
  const [loading, setLoading] = useState(true);
  const [openShareDialog, setOpenShareDialog] = useState(false);

  const user = JSON.parse(sessionStorage.getItem('user'));
  const profileId = sessionStorage.getItem('jobseekerProfileId');
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };

  const shareableUrl = `${window.location.origin}/profile/share/${profileId}`;

  const handleOpenShareDialog = () => setOpenShareDialog(true);
  const handleCloseShareDialog = () => setOpenShareDialog(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareableUrl);
    alert("Link copied to clipboard!");
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
  };

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        // Fetch digital profile data
        const digitalResponse = await axios.get(
          `${BaseUrl}/jobseekerprofile/v1/getDigitalJobSeekerProfileById/${profileId}`,
          { headers }
        );
        const digitalData = digitalResponse.data;

        // Fetch basic profile data for personal details
        const jobSeekerId = parseInt(user?.seekerId);
        const basicResponse = await axios.get(
          `${BaseUrl}/jobseekerprofile/v1/getJobSeekerProfileByJobSeekerId/${jobSeekerId}`,
          { headers }
        );
        const basicData = basicResponse.data;

        // Set profile data for personal details and about
        setProfileData({
          jobseekerProfileName: basicData.jobseekerProfileName || "",
          description: basicData.description || "",
          email: basicData.email || "",
          mobileNumber: basicData.mobileNumber || "",
          designation: basicData.designation || "",
          location: basicData.location || "",
          linkedin: basicData.linkedin || "",
          website: basicData.website || ""
        });

        // Set resume data for other sections
        setResumeData({
          personalInfo: {
            name: digitalData.jobseekerProfileName,
            title: digitalData.description,
            email: digitalData.email,
            phone: digitalData.mobileNumber,
            description: digitalData.summary || "Professional with extensive experience in the field."
          },
          currentEmployment: digitalData.digitalCurrentEmploymentDto,
          workExperience: digitalData.digitalJobSeekerExperienceDto || [],
          education: digitalData.digitalEducationDto || [],
          skills: digitalData.digitalJobSeekerSkillDto || [],
          projects: digitalData.digitalJobSeekerProfileProjectDto || [],
          certificates: digitalData.digitalJobSeekerProfileCertificateDto || [],
          languages: digitalData.digitalJobSeekerLanguageDto || [],
          courses: digitalData.digitalJobSeekerCourseDto || [],
          socialMedia: digitalData.digitalSocialmediaDto || [],
          awards: digitalData.digitalAwardDto || []
        });
      } catch (error) {
        console.error("Error fetching resume data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResumeData();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    pageStyle: `@page { size: A4; margin: 10mm; } @media print { body { -webkit-print-color-adjust: exact; } .no-print { display: none !important; } }`
  });

  if (loading) return <Typography>Loading resume...</Typography>;
  if (!resumeData) return <Typography>Error loading resume data</Typography>;

  // Render mobile view for smaller screens
  if (isMobile) {
    return (
      <MobileDigitalPreviewCard 
        resumeData={resumeData} 
        profileData={profileData} 
      />
    );
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', px: 0, py: 0 }}>
      <MainCard>


        {/* Basic Details */}
        <Basic_Details />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -3 }}>
          <Button
            variant="contained"
            startIcon={<ShareIcon />}
            onClick={handleOpenShareDialog}
            sx={{
              width: 177,
              height: 51,
              borderRadius: '8px',
              backgroundColor: '#006D77',
              boxShadow: '0px 0px 4px 0px #00000040',
              opacity: 1,
              '&:hover': {
                backgroundColor: '#006D77',
                opacity: 0.9,
                boxShadow: '0px 0px 6px 0px #00000060'
              }
            }}
          >
            Share Profile
          </Button>
        </Box>


        {/* Main Content - Single Column Layout */}
        <Box sx={{ px: 3, maxWidth: '1200px', mx: 'auto' }}>
          {/* Personal Details Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessCenterIcon sx={{ color: '#0095a5', mr: 1 }} />
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
            </Box>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              {/* Column 1 */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Name :</Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                      {profileData.jobseekerProfileName || "Name"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Email :</Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                      {profileData.email || "Email"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Column 2 */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Location :</Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                      {profileData.location || "Location"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Phone no :</Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                      {profileData.mobileNumber || "Phone Number"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Column 3 */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Designation :</Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                      {profileData.designation || "Designation"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Website/Portfolio :</Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                      {profileData.website ? (
                        <Link
                          href={profileData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: '#333',
                            textDecoration: 'underline',
                            '&:hover': {
                              textDecoration: 'underline',
                              color: 'blue'
                            }
                          }}
                        >
                          view website
                        </Link>
                      ) : (
                        "Website/Portfolio"
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Column 4 */}
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>LinkedIn :</Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                      {profileData.linkedin ? (
                        <Link
                          href={profileData.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: '#333',
                            textDecoration: 'underline',
                            '&:hover': {
                              textDecoration: 'underline',
                              color: 'blue'
                            }
                          }}
                        >
                          LinkedIn URL
                        </Link>
                      ) : (
                        "LinkedIn URL"
                      )}
                    </Typography>
                  </Box>
                   <Box>
                     <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>GitHub :</Typography>
                     <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                       {resumeData?.socialMedia?.find(social => social.socialmediaName?.toLowerCase().includes('github'))?.socialmediaLink ? (
                         <Link
                           href={resumeData.socialMedia.find(social => social.socialmediaName?.toLowerCase().includes('github')).socialmediaLink}
                           target="_blank"
                           rel="noopener noreferrer"
                           sx={{
                             color: '#333',
                             textDecoration: 'underline',
                             '&:hover': {
                               textDecoration: 'underline',
                               color: 'blue'
                             }
                           }}
                         >
                           View GitHub
                         </Link>
                       ) : (
                         "GitHub URL"
                       )}
                     </Typography>
                   </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* About Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ color: '#0095a5', mr: 1 }} />
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
            </Box>
            <Divider sx={{ my: 2 }} />
            <ReadMore text={profileData.description || "add your profile description here..."} maxLength={200} />
          </Box>

          {/* Employment Section */}
          {resumeData.currentEmployment && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkHistoryIcon sx={{ color: '#0095a5', mr: 1 }} />
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
                  Employment
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={3}>
                {/* Row 1 */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Company Name :</Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                      {resumeData.currentEmployment.companyName || "Company Name"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Employment Type :</Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                      {resumeData.currentEmployment.employmentType || "Employment Type"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Job Title :</Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                      {resumeData.currentEmployment.jobTitle || "Job Title"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Current CTC :</Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                      {resumeData.currentEmployment.currentctc || "Current CTC"}
                    </Typography>
                  </Box>
                </Grid>

                {/* Row 2 */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Skills :</Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                      {resumeData.currentEmployment.skill || "Skills"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Notice Period :</Typography>
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                      {resumeData.currentEmployment.noticePeriod || "Notice Period"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Job Description :</Typography>
                    <ReadMore text={resumeData.currentEmployment.jobDescription || "Job Description"} maxLength={50} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input type="checkbox" checked readOnly style={{ margin: 0 }} />
                    <Typography variant="body2" sx={{ color: '#333', fontSize: '14px' }}>
                      Currently working here
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Work Experience Section */}
          {resumeData.workExperience.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkHistoryIcon sx={{ color: '#0095a5', mr: 1 }} />
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
                  Work Experience
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              {resumeData.workExperience.map((exp, i) => (
                <Grid container spacing={3} key={i} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Designation :</Typography>
                        <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                          {exp.designation || "Designation"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Company Name :</Typography>
                        <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                          {exp.companyName || "Company Name"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Duration :</Typography>
                        <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                          {formatDate(exp.fromDate)} - {formatDate(exp.toDate)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Experience Years :</Typography>
                        <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                          {exp.experienceYears ? `${exp.experienceYears} Years` : "Experience Years"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Description :</Typography>
                        <ReadMore text={exp.description || "Work experience description"} maxLength={50} />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              ))}
            </Box>
          )}

          {/* Education Section */}
          {resumeData.education.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ color: '#0095a5', mr: 1 }} />
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
                  Education
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              {resumeData.education.map((edu, i) => (
                <Grid container spacing={3} key={i} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Degree type :</Typography>
                        <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                          {edu.educationName || "Degree Type"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Description :</Typography>
                        <ReadMore text={edu.description || "Description"} maxLength={50} />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>College Name :</Typography>
                        <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                          {edu.instituteName || "College Name"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Percentage /CGPA :</Typography>
                        <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                          {edu.percentage ? `${edu.percentage}%` : "Percentage/CGPA"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Start year :</Typography>
                        <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                          {edu.fromDate ? new Date(edu.fromDate).getFullYear() : "Start Year"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>End year :</Typography>
                        <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                          {edu.toDate ? new Date(edu.toDate).getFullYear() : "End Year"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              ))}
            </Box>
          )}

          {/* Courses Section */}
          {resumeData.courses.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CourseIcon sx={{ color: '#0095a5', mr: 1 }} />
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
                  Courses
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              {resumeData.courses.map((course, i) => (
                <Grid container spacing={3} key={i} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6} md={6}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Course Name :</Typography>
                      <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                        {course.courseName || "Course Name"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#666', fontSize: '14px',fontWeight: 'bold' }}>Description :</Typography>
                      <ReadMore text={course.description || "Course description goes here..."} maxLength={50} />
                    </Box>
                  </Grid>
                </Grid>
              ))}
            </Box>
          )}

          {/* Skills Section */}
          {resumeData.skills.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbOutlinedIcon sx={{ color: '#0095a5', mr: 1 }} />
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
                  Skills
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={1} sx={{ mt: 2 }}>
                {resumeData.skills.map((skill, i) => (
                  <Grid item xs={12} sm={6} md={2} key={i}>
                    <Chip
                      label={skill.skillName || "Skill"}
                      sx={{
                        backgroundColor: '#0195A3',
                        color: 'white',
                        width: '150px',
                        height: '45px',
                        borderRadius: '20px',
                        opacity: 1,
                        '&:hover': {
                          backgroundColor: '#017a85'
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

           {/* Projects Section */}
           {resumeData.projects.length > 0 && (
             <Box sx={{ mb: 4 }}>
               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                 <CodeIcon sx={{ color: '#0095a5', mr: 1 }} />
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
                   Projects
                 </Typography>
               </Box>
               <Divider sx={{ my: 2 }} />
               {resumeData.projects.map((project, i) => (
                 <Grid container spacing={3} key={i} sx={{ mt: 2 }}>
                   <Grid item xs={12} sm={6} md={6}>
                     <Box>
                       <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Project Name :</Typography>
                       <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                         {project.projectName || "Project Name"}
                       </Typography>
                     </Box>
                   </Grid>
                   <Grid item xs={12} sm={6} md={6}>
                     <Box>
                       <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>Skills :</Typography>
                       <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
                         {project.skill || "Skills"}
                       </Typography>
                     </Box>
                   </Grid>
                   <Grid item xs={12} sm={6} md={6}>
                     <Box>
                       <Typography variant="body2" sx={{ color: '#666', fontSize: '14px',fontWeight: 'bold' }}>Description :</Typography>
                       <ReadMore text={project.description || "Project description goes here..."} maxLength={50} />
                     </Box>
                   </Grid>
                   <Grid item xs={12} sm={6} md={6}>
                     {project.projectUrl && (
                       <Box>
                         <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>URL :</Typography>
                         <Typography variant="body2" sx={{ color: '#333', fontSize: '16px' }}>
                           <Link href={project.projectUrl} target="_blank" sx={{ color: '#0195A3', textDecoration: 'underline' }}>
                             View Project
                           </Link>
                         </Typography>
                       </Box>
                     )}
                   </Grid>
                 </Grid>
               ))}
             </Box>
           )}

          {/* Languages Section */}
          {resumeData.languages.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LanguageIcon sx={{ color: '#0095a5', mr: 1 }} />
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
                  Languages
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={1} sx={{ mt: 2 }}>
                {resumeData.languages.map((lang, i) => (
                  <Grid item xs={12} sm={6} md={2} key={i}>
                    <Chip
                      label={lang.languageName || "Language"}
                      sx={{
                        backgroundColor: '#0195A3',
                        color: 'white',
                        width: '150px',
                        height: '45px',
                        borderRadius: '20px',
                        opacity: 1,
                        '&:hover': {
                          backgroundColor: '#017a85'
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Social Media Section */}
          {resumeData.socialMedia.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SocialIcon sx={{ color: '#0095a5', mr: 1 }} />
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
                  Social Media
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {resumeData.socialMedia.map((social, i) => {
                  const getSocialIcon = (platform) => {
                    const platformName = platform.toLowerCase();
                    if (platformName.includes('facebook')) return <FacebookIcon sx={{ color: '#1877F2' }} />;
                    if (platformName.includes('twitter') || platformName.includes('x.com')) return <TwitterIcon sx={{ color: '#1DA1F2' }} />;
                    if (platformName.includes('linkedin')) return <LinkedInIcon sx={{ color: '#0077B5' }} />;
                    if (platformName.includes('instagram')) return <InstagramIcon sx={{ color: '#E4405F' }} />;
                    if (platformName.includes('youtube')) return <YouTubeIcon sx={{ color: '#FF0000' }} />;
                    if (platformName.includes('github')) return <GitHubIcon sx={{ color: '#333' }} />;
                    return <SocialIcon sx={{ color: '#0095a5' }} />;
                  };

                  return (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                      <Link
                        href={social.socialmediaLink}
                        target="_blank"
                        rel="noopener"
                        style={{ textDecoration: 'none' }}
                      >
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                            borderColor: '#0095a5'
                          }
                        }}>
                          {getSocialIcon(social.socialmediaName)}
                          <Typography variant="body1" sx={{
                            color: '#333',
                            fontWeight: 500,
                            '&:hover': { color: '#0095a5' }
                          }}>
                            {social.socialmediaName}
                          </Typography>
                        </Box>
                      </Link>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          {/* Certificates Section */}
          {resumeData.certificates.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CertificateIcon sx={{ color: '#0095a5', mr: 1 }} />
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
                  Certifications
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {resumeData.certificates.map((cert, i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 1.5,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <Box sx={{
                        width: '100%',
                        height: 150,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        mb: 1.5
                      }}>
                        <AuthImage
                          filePath={cert.filePath}
                          alt={cert.certificateName}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            borderRadius: 4
                          }}
                        />
                      </Box>
                      <Typography variant="body1" fontWeight="bold" align="center" sx={{ fontSize: '14px' }}>
                        {cert.certificateName}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Awards Section */}
          {resumeData.awards.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiEventsIcon sx={{ color: '#0095a5', mr: 1 }} />
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
                  Awards
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {resumeData.awards.map((award, i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 1.5,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <Box sx={{
                        width: '100%',
                        height: 150,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        mb: 1.5
                      }}>
                        {award.filePath ? (
                          <AuthImage
                            filePath={award.filePath}
                            alt={award.awardName}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              borderRadius: 4
                            }}
                          />
                        ) : (
                          <EmojiEventsIcon sx={{ fontSize: 40, color: '#0095a5' }} />
                        )}
                      </Box>
                      <Typography variant="body1" fontWeight="bold" align="center" sx={{ fontSize: '14px' }}>
                        {award.awardName}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
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
              <IconButton component="a" href={`https://www.facebook.com/sharer/sharer.php?u=${shareableUrl}`} target="_blank"><FacebookIcon /></IconButton>
              <IconButton component="a" href={`https://twitter.com/intent/tweet?url=${shareableUrl}`} target="_blank"><TwitterIcon /></IconButton>
              <IconButton component="a" href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareableUrl}`} target="_blank"><LinkedInIcon /></IconButton>
              <IconButton component="a" href={`https://wa.me/?text=${shareableUrl}`} target="_blank"><WhatsAppIcon /></IconButton>
              <IconButton component="a" href={`mailto:?subject=Check%20my%20resume&body=${shareableUrl}`}><EmailIcon /></IconButton>
              <IconButton onClick={handleCopy}><ContentCopyIcon /></IconButton>
            </Stack>
          </DialogContent>
        </Dialog>
      </MainCard>
    </Box>
  );
};

export default DigitalPreview;
