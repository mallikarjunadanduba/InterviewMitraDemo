import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Alert, 
  Box, 
  useTheme, 
  useMediaQuery, 
  Button, 
  Chip,
  Container,
  Stack,
  Avatar,
  Fade,
  Zoom
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { fetchCourseByCourseId, fetchModulesByCourseId, fetchTopicsBymoduleId } from 'views/API/UpskillsCategoryApi';
import { Pagination } from '@mui/material';
import { useParams } from 'react-router-dom';
import { IconLock, IconArrowLeft, IconStar, IconClock, IconUsers, IconCurrencyRupee } from '@tabler/icons-react';
import { PlayCircleOutline, School, CheckCircle } from '@mui/icons-material';

const SingleCourseDetails = () => {
  const [details, setDetails] = useState({});
  const [modules, setModules] = useState([]);
  const [topics, setTopics] = useState({}); // Store topics by moduleId
  const [moduleError, setModuleError] = useState(null);
  const [topicError, setTopicError] = useState(null);
  const [courseError, setCourseError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId, isPaid } = location.state || {};
  const [currentPage, setCurrentPage] = useState(1);
  const topicsPerPage = 5; // Number of topics per page
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };




  // Fetch all data (course, modules, and topics for each module)
  const fetchAllData = async () => {
    try {
      // Fetch course details
      const courseRes = await fetchCourseByCourseId(headers, courseId);
      if (courseRes.data) {
        setDetails(courseRes.data);
        setCourseError(null);
      } else {
        setDetails({});
        setCourseError('Course data not found.');
      }

      // Fetch modules
      const modulesRes = await fetchModulesByCourseId(headers, courseId);
      if (modulesRes.data.length > 0) {
        setModules(modulesRes.data);
        setModuleError(null);
        // Set initial selected module to first module
        setSelectedModuleId(modulesRes.data[0]?.moduleId);

        // Fetch topics for each module
        const topicsByModule = {};
        for (const module of modulesRes.data) {
          const topicsRes = await fetchTopicsBymoduleId(headers, module.moduleId);
          if (topicsRes.data.length > 0) {
            topicsByModule[module.moduleId] = topicsRes.data;
          } else {
            topicsByModule[module.moduleId] = [];
            setTopicError('No topics found for this module.');
          }
        }
        setTopics(topicsByModule); // Store all topics by moduleId
      } else {
        setModules([]);
        setModuleError('No modules found for this course.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setCourseError('Failed to fetch course data.');
      setModuleError('Failed to fetch modules.');
      setTopicError('Failed to fetch topics.');
    }
  };

  const handleModuleClick = (moduleId) => {
    setSelectedModuleId(moduleId);
    setCurrentPage(1); // Reset to first page when changing modules
  };

  // Fetch all data when the component mounts
  useEffect(() => {
    if (courseId) {
      fetchAllData();
    }
  }, [courseId]);

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>

      {/* Modern Header Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '300px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.2) 0%, transparent 50%)
            `,
            animation: 'float 20s ease-in-out infinite'
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, height: '300px', display: 'flex', alignItems: 'center' }}>
          <Fade in timeout={1200}>
            <Box sx={{ width: '100%' }}>
              {/* Back Button */}
              <Button
                startIcon={<IconArrowLeft size={20} />}
                onClick={() => navigate(-1)}
                sx={{
                  mb: 3,
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Back to Courses
              </Button>

              {/* Course Title and Info */}
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 2,
                    fontSize: { xs: '1.8rem', md: '2.5rem' },
                    background: 'linear-gradient(45deg, #ffffff, #f0f8ff, #ffffff)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {details.courseName || 'Course Details'}
                </Typography>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.95,
                    fontWeight: 400,
                    maxWidth: '600px',
                    mx: 'auto',
                    mb: 3,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    lineHeight: 1.6
                  }}
                >
                  {details.description || 'Explore this comprehensive course'}
                </Typography>

                {/* Course Stats */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={4} 
                  justifyContent="center"
                  sx={{ mt: 3 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: '#ffd700' }}>
                      4.8
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Rating
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: '#00d4aa' }}>
                      {modules.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Modules
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: '#ff6b9d' }}>
                      {selectedModuleId && topics[selectedModuleId] ? topics[selectedModuleId].length : 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Topics
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Course Details Section */}
        {courseError ? (
          <Card sx={{ mt: 2, p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <Alert severity="error">{courseError}</Alert>
          </Card>
        ) : (
          <Zoom in timeout={800}>
            <Card
              sx={{
                mt: 2,
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
                border: '1px solid rgba(0,0,0,0.06)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                }
              }}
            >
              <Grid container sx={{ height: '100%', alignItems: 'stretch' }}>
                {/* Left Side - Video */}
                <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                  <Box
                    sx={{
                      width: '100%',
                      p: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      minHeight: '400px'
                    }}
                  >
                    {isPaid ? (
                      <iframe
                        title="YouTube Video"
                        src={`https://www.youtube.com/embed/${details.videoUrl}`}
                        frameBorder="0"
                        allowFullScreen
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '16px',
                          aspectRatio: '16/9',
                          objectFit: 'cover'
                        }}
                      ></iframe>
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          aspectRatio: '16/9',
                          borderRadius: '16px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `
                              radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.2) 0%, transparent 50%)
                            `,
                            animation: 'float 20s ease-in-out infinite'
                          }
                        }}
                      >
                        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white' }}>
                          <IconLock size={80} style={{ marginBottom: '20px', opacity: 0.8 }} />
                          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                            Course Locked
                          </Typography>
                          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                            Purchase this course to access video content
                          </Typography>
                          <Chip
                            label="Premium Content"
                            sx={{
                              background: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              border: '1px solid rgba(255,255,255,0.3)',
                              backdropFilter: 'blur(10px)',
                              fontWeight: 600,
                              fontSize: '1rem',
                              px: 3,
                              py: 1
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>

                {/* Right Side - Content */}
                <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                  <Box sx={{ width: '100%', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#333', mb: 2, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                      {details.courseName}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ color: '#666', mb: 3, lineHeight: 1.6, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                      {details.description}
                    </Typography>

                    {/* Course Stats */}
                    <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        boxShadow: '0 2px 8px rgba(255,215,0,0.2)'
                      }}>
                        <IconStar size={16} color="#ff6b35" />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                          4.8 Rating
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        boxShadow: '0 2px 8px rgba(102,126,234,0.2)'
                      }}>
                        <IconClock size={16} color="white" />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                          8 Hours
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        boxShadow: '0 2px 8px rgba(76,175,80,0.2)'
                      }}>
                        <IconUsers size={16} color="white" />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                          1.2k Students
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Price and Discount Section */}
                    <Box sx={{ 
                      mt: 3, 
                      p: 3, 
                      borderRadius: 3, 
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      border: '1px solid rgba(0,0,0,0.08)'
                    }}>
                      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          boxShadow: '0 2px 8px rgba(76,175,80,0.2)'
                        }}>
                          <IconCurrencyRupee size={16} color="white" />
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                            ₹{details.sellingPrice}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          boxShadow: '0 2px 8px rgba(255,107,107,0.2)'
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', textDecoration: 'line-through' }}>
                            ₹{details.courseMrp}
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700 }}>
                        You Save: ₹{details.courseMrp - details.sellingPrice} ({details.discount}% off)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Zoom>
        )}

        {/* Modules Section */}
        <Zoom in timeout={1000}>
          <Card
            sx={{
              mt: 3,
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
              border: '1px solid rgba(0,0,0,0.06)'
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#333', textAlign: 'center' }}>
                Course Modules
              </Typography>
              
              {moduleError ? (
                <Alert severity="error">{moduleError}</Alert>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 2,
                    pb: 1,
                    '&::-webkit-scrollbar': {
                      height: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#667eea',
                      borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f5f5f5',
                      borderRadius: '10px',
                    },
                  }}
                >
                  {modules.map((module, index) => (
                    <Zoom in timeout={1200 + index * 100} key={module.moduleId}>
                      <Card
                        onClick={() => handleModuleClick(module.moduleId)}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 3,
                          background: selectedModuleId === module.moduleId 
                            ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                            : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                          color: selectedModuleId === module.moduleId ? 'white' : '#333',
                          border: selectedModuleId === module.moduleId
                            ? '2px solid #667eea'
                            : '1px solid rgba(0,0,0,0.1)',
                          boxShadow: selectedModuleId === module.moduleId 
                            ? '0 8px 25px rgba(102,126,234,0.3)' 
                            : '0 2px 10px rgba(0,0,0,0.08)',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: selectedModuleId === module.moduleId 
                              ? '0 12px 35px rgba(102,126,234,0.4)' 
                              : '0 8px 25px rgba(0,0,0,0.15)',
                            background: selectedModuleId === module.moduleId 
                              ? 'linear-gradient(45deg, #5a6fd8, #6a4190)' 
                              : 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          padding: '16px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '60px',
                          minWidth: '180px',
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            textAlign: 'center',
                            transition: 'color 0.3s ease',
                            fontSize: { xs: '0.9rem', md: '1rem' }
                          }}
                        >
                          {module.moduleName}
                        </Typography>
                      </Card>
                    </Zoom>
                  ))}
                </Box>
              )}
            </Box>
          </Card>
        </Zoom>







        {/* Topics Section with Pagination */}
        <Zoom in timeout={1400}>
          <Card
            sx={{
              mt: 3,
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
              border: '1px solid rgba(0,0,0,0.06)'
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#333', textAlign: 'center' }}>
                Course Topics
              </Typography>
              
              {topicError ? (
                <Alert severity="error">{topicError}</Alert>
              ) : selectedModuleId && topics[selectedModuleId] ? (
                <Grid container spacing={3}>
                  {topics[selectedModuleId].slice((currentPage - 1) * topicsPerPage, currentPage * topicsPerPage).map((topic, index) => (
                    <Grid item xs={12} key={topic.topicId}>
                      <Zoom in timeout={1600 + index * 100}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
                            border: '1px solid rgba(0,0,0,0.06)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                          <Grid container sx={{ height: '100%', alignItems: 'stretch' }}>
                            {/* Thumbnail Section */}
                            <Grid item xs={12} sm={4} sx={{ display: 'flex' }}>
                              <Box
                                sx={{
                                  width: '100%',
                                  p: 2,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  position: 'relative',
                                  minHeight: '200px'
                                }}
                              >
                                {topic.videoUrl && isPaid ? (
                                  <iframe
                                    title={`YouTube Video for ${topic.topicName}`}
                                    src={`https://www.youtube.com/embed/${topic.videoUrl}`}
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      borderRadius: '12px',
                                      aspectRatio: '16/9'
                                    }}
                                  ></iframe>
                                ) : topic.videoUrl ? (
                                  <Box
                                    sx={{
                                      width: '100%',
                                      aspectRatio: '16/9',
                                      borderRadius: '12px',
                                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      position: 'relative',
                                      overflow: 'hidden',
                                      '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: `
                                          radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
                                          radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.3) 0%, transparent 50%),
                                          radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.2) 0%, transparent 50%)
                                        `,
                                        animation: 'float 20s ease-in-out infinite'
                                      }
                                    }}
                                  >
                                    <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white' }}>
                                      <IconLock size={40} style={{ marginBottom: '12px', opacity: 0.8 }} />
                                      <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem', opacity: 0.9 }}>
                                        Locked
                                      </Typography>
                                    </Box>
                                  </Box>
                                ) : (
                                  <Box
                                    sx={{
                                      width: '100%',
                                      aspectRatio: '16/9',
                                      borderRadius: '12px',
                                      background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      border: '2px dashed #ccc'
                                    }}
                                  >
                                    <Typography variant="body1" sx={{ color: '#666', fontWeight: 500 }}>
                                      No Video
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Grid>

                            {/* Content Section */}
                            <Grid item xs={12} sm={8} sx={{ display: 'flex' }}>
                              <Box sx={{ width: '100%', p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 2, fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
                                  {topic.topicName}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                  {topic.description}
                                </Typography>
                                
                                {/* Topic Status */}
                                <Box sx={{ mt: 2 }}>
                                  <Chip
                                    icon={isPaid ? <CheckCircle /> : <IconLock size={16} />}
                                    label={isPaid ? "Available" : "Locked"}
                                    sx={{
                                      background: isPaid 
                                        ? 'linear-gradient(45deg, #4caf50, #8bc34a)' 
                                        : 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                                      color: 'white',
                                      fontWeight: 600,
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Card>
                      </Zoom>
                    </Grid>
                  ))}
                  
                  {/* Pagination */}
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={Math.ceil(topics[selectedModuleId].length / topicsPerPage)}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      variant="outlined"
                      shape="rounded"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: 2,
                          fontWeight: 600
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                    No topics found for the selected module.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    Please select a different module to view topics.
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Zoom>
      </Container>


    </>
  );
};

export default SingleCourseDetails;
