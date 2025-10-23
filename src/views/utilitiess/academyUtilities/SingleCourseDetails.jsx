import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Grid, Button, Card, CardContent, Alert } from '@mui/material';
import { Box } from '@mui/system';
import MainCard from 'ui-component/cards/MainCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { fetchCourseByCourseId, fetchModulesByCourseId, fetchTopicsBymoduleId } from 'views/API/AcademyCategoryApi';

const SingleCourseDetails = () => {
  const [details, setDetails] = useState({});
  const [modules, setModules] = useState([]);
  const [topics, setTopics] = useState([]);
  const [visibleTopicId, setVisibleTopicId] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [moduleError, setModuleError] = useState(null);
  const [topicError, setTopicError] = useState(null);
  const [courseError, setCourseError] = useState(null);
  const location = useLocation();
  const { courseId } = location.state || {};

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };

  const fetchData = async () => {
    try {
      const courseRes = await fetchCourseByCourseId(headers, courseId);
      const fetchedCourse = courseRes.data;
      if (fetchedCourse) {
        setDetails(fetchedCourse);
        setCourseError(null);
      } else {
        setDetails({});
        setCourseError('Course data not found.');
      }

      const modulesRes = await fetchModulesByCourseId(headers, courseId);
      const fetchedModules = modulesRes.data;
      if (fetchedModules.length > 0) {
        setModules(fetchedModules);
        setModuleError(null);
      } else {
        setModules([]);
        setModuleError('No modules found for this course.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setCourseError('Failed to fetch course data.');
      setModuleError('Failed to fetch modules.');
    }
  };

  const fetchTopics = async (moduleId) => {
    try {
      const topicsRes = await fetchTopicsBymoduleId(headers, moduleId);
      const fetchedTopics = topicsRes.data;
      if (fetchedTopics.length > 0) {
        setTopics(fetchedTopics);
        setTopicError(null);
      } else {
        setTopics([]);
        setTopicError('No topics found for this module.');
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopicError('Failed to fetch topics.');
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const handleModuleClick = (moduleId) => {
    setActiveModule(moduleId);
    fetchTopics(moduleId);
  };

  const toggleDescription = (topicId) => {
    setVisibleTopicId(visibleTopicId === topicId ? null : topicId);
  };

  return (
    <>
      {courseError ? (
        <MainCard sx={{ mt: 2 }}>
          <Alert severity="error">{courseError}</Alert>
        </MainCard>
      ) : (
        <MainCard sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {details.courseName}
                  <Button
                    sx={{
                      justifyContent: 'right',
                      alignItems: 'center',
                      borderRadius: '50%',
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                    onClick={() => toggleDescription(null)}
                  >
                    <InfoOutlinedIcon />
                  </Button>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Typography variant="h6">₹{details.sellingPrice}</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', textDecoration: 'line-through', ml: 2 }}>
                    ₹{details.courseMrp}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'green', ml: 2 }}>
                    {details.discount}% off
                  </Typography>
                </Box>
                {visibleTopicId === null && (
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    Description: {details.description}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <iframe
                  title="YouTube Video"
                  src={`https://www.youtube.com/embed/${details.videoUrl}`}
                  frameBorder="0"
                  allowFullScreen
                  style={{ width: '100%', height: '350px', borderRadius: '20px' }}
                ></iframe>
              </Box>
            </Grid>
          </Grid>
        </MainCard>
      )}

      <MainCard sx={{ mt: 2 }}>
        {moduleError ? (
          <Alert severity="error">{moduleError}</Alert>
        ) : (
          <Grid container spacing={2}>
            {modules.map((module) => (
              <Grid item xs={12} sm={6} md={3} key={module.moduleId}>
                <Card
                  onClick={() => handleModuleClick(module.moduleId)}
                  sx={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer'
                    },
                    margin: 2
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {module.moduleName}
                    </Typography>
                    <Typography variant="body2">{module.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </MainCard>

      {activeModule && (
        <MainCard sx={{ mt: 2 }}>
          {topicError ? (
            <Alert severity="error">{topicError}</Alert>
          ) : (
            <Grid container spacing={2}>
              {topics.map((topic) => (
                <Grid item xs={12} sm={6} md={4} key={topic.topicId}>
                  <Card
                    sx={{
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                        cursor: 'pointer'
                      },
                      margin: 2
                    }}
                  >
                    <CardContent>
                      {topic.videoUrl && (
                        <iframe
                          title={`YouTube Video for ${topic.topicName}`}
                          src={`https://www.youtube.com/embed/${topic.videoUrl}`}
                          frameBorder="0"
                          allowFullScreen
                          style={{ width: '100%', height: '200px', borderRadius: '8px', marginTop: '10px' }}
                        ></iframe>
                      )}
                      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                        {topic.topicName}
                        <Button
                          sx={{
                            justifyContent: 'right',
                            alignItems: 'center',
                            borderRadius: '50%',
                            backgroundColor: 'transparent',
                            '&:hover': {
                              backgroundColor: 'action.hover'
                            }
                          }}
                          onClick={() => toggleDescription(topic.topicId)}
                        >
                          <InfoOutlinedIcon />
                        </Button>
                      </Typography>
                      {visibleTopicId === topic.topicId && <Typography variant="body2">{topic.description}</Typography>}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </MainCard>
      )}
    </>
  );
};

export default SingleCourseDetails;
