import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { fetchCourseByCategoryId } from 'views/API/AcademyCategoryApi';
import MainCard from 'ui-component/cards/MainCard';

const CourseDetails = () => {
  const [details, setDetails] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [visibleDescription, setVisibleDescription] = useState(null);

  const location = useLocation();
  const { categoryId, categoryName } = location.state || {};

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await fetchCourseByCategoryId(headers, categoryId);
      const fetchedData = res.data;
      if (fetchedData) {
        setDetails(fetchedData);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  const handleViewAll = () => {
    setShowAll(true);
  };

  const toggleDescription = (event, courseId) => {
    event.stopPropagation();
    setVisibleDescription(visibleDescription === courseId ? null : courseId);
  };

  const handleCourseDetails = (courseId) => {
    navigate('course-details', { state: { courseId } });
  };

  return (
    <>
      <MainCard>
        <Typography variant="h3" gutterBottom>
          Course Details for {categoryName}
        </Typography>
      </MainCard>
      <Grid container spacing={2}>
        {(showAll ? details : details.slice(0, 4)).map((detail) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={detail.courseId}>
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
              onClick={() => handleCourseDetails(detail.courseId)}
            >
              <CardContent>
                {detail.videoUrl && (
                  <iframe
                    title="YouTube Video"
                    src={`https://www.youtube.com/embed/${detail.videoUrl}`}
                    frameBorder="0"
                    allowFullScreen
                    style={{ width: '100%', height: '190px', marginBottom: '1rem' }}
                  ></iframe>
                )}
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {detail.courseName}
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
                    onClick={(e) => toggleDescription(e, detail.courseId)}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: 24 }} />
                  </Button>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">₹{detail.sellingPrice}</Typography>

                  <Typography variant="body1" sx={{ color: 'text.secondary', textDecoration: 'line-through', ml: 2 }}>
                    ₹{detail.courseMrp}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'green', ml: 2 }}>
                    {detail.discount}% off
                  </Typography>
                </Box>

                {visibleDescription === detail.courseId && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {detail.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {details.length > 4 && !showAll && (
        <Box sx={{ textAlign: { sm: 'right', xs: 'center' }, mt: 2, mr: 2 }}>
          <Button variant="contained" color="primary" onClick={handleViewAll}>
            View All
          </Button>
        </Box>
      )}
    </>
  );
};

export default CourseDetails;
