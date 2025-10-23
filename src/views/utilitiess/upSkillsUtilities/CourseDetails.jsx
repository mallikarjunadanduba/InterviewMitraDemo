import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  useMediaQuery, 
  useTheme, 
  Alert, 
  Snackbar, 
  Divider, 
  Chip,
  Container,
  Paper,
  Avatar,
  Rating,
  IconButton,
  Fade,
  Zoom,
  Skeleton,
  CardMedia,
  Stack,
  Badge
} from '@mui/material';
import { 
  PlayCircleOutline, 
  Star, 
  AccessTime, 
  People, 
  TrendingUp,
  CheckCircle,
  ArrowForward,
  School,
  BookmarkBorder,
  Bookmark,
  Share,
  FavoriteBorder,
  Favorite,
  Lock
} from '@mui/icons-material';
import { fetchCourseByCategoryId } from 'views/API/UpskillsCategoryApi';
import { createCoursePayment, paymentDone, paymentFailed } from 'views/API/MyCourseApi';
import MainCard from 'ui-component/cards/MainCard';
import YouTubePlayer from 'ui-component/YouTubePlayer/YouTubePlayer';

const CourseDetails = () => {
  const [details, setDetails] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [visibleDescription, setVisibleDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [alreadyPurchasedCourses, setAlreadyPurchasedCourses] = useState(new Set());
  const [bookmarkedCourses, setBookmarkedCourses] = useState(new Set());
  const [favoriteCourses, setFavoriteCourses] = useState(new Set());
  const [dataLoading, setDataLoading] = useState(true);

  const location = useLocation();
  const { categoryId, categoryName } = location.state || {};
  
  // Check if user has purchased any courses (you can implement this logic based on your needs)
  const isCoursePurchased = (courseId) => {
    return alreadyPurchasedCourses.has(courseId);
  };

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const res = await fetchCourseByCategoryId(headers, categoryId);
      console.log(res.data)
      const fetchedData = res.data;
      if (fetchedData) {
        setDetails(fetchedData);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setDataLoading(false);
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

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubscribe = async (amount, courseId) => {
    try {
      setLoading(true);
      
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        showSnackbar('Payment system is not loaded. Please refresh the page and try again.', 'error');
        setLoading(false);
        return;
      }
      
      // Create course payment using the new API
      const response = await createCoursePayment(headers, user.seekerId, courseId, amount);
      console.log('Payment response:', response.data);
      
      const paymentData = response.data;
      
      // Check if course is already purchased
      if (paymentData && paymentData.status === 'already_purchased') {
        showSnackbar(paymentData.message || 'This course is already purchased by you', 'info');
        // Add course to already purchased set
        setAlreadyPurchasedCourses(prev => new Set([...prev, courseId]));
        setLoading(false);
        return;
      }
      
      console.log('Response structure check:', {
        hasRazorPay: !!paymentData.razorPay,
        hasOrderId: !!paymentData.razorPay?.razorpayOrderId,
        razorPayData: paymentData.razorPay
      });
      
      if (paymentData && paymentData.razorPay && paymentData.razorPay.razorpayOrderId) {
        // Initialize Razorpay Checkout
        const options = {
          key: 'rzp_test_c09ktph3IirGmG', // Your Razorpay key
          amount: Math.round(parseFloat(paymentData.razorPay.amount) * 100), // Convert amount to paise
          currency: 'INR',
          name: paymentData.razorPay.merchantName || 'Course Subscription',
          description: paymentData.razorPay.purchaseDescription || 'Payment for course subscription',
          image: '/src/assets/images/logo/Interview_mitra_logo.png',
          order_id: paymentData.razorPay.razorpayOrderId,
          handler: async function (response) {
            try {
              // Call payment done API
              await paymentDone(
                headers,
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature,
                'success'
              );
              
              showSnackbar('Payment successful! Course added to your account.', 'success');
              
              // Navigate to My Courses after a short delay
              setTimeout(() => {
                navigate('/upSkills/my-courses');
              }, 2000);
              
            } catch (error) {
              console.error('Error processing payment success:', error);
              showSnackbar('Payment successful but there was an error updating your account. Please contact support.', 'warning');
            }
          },
          modal: {
            ondismiss: async function() {
              try {
                // Call payment failed API if user closes the modal
                await paymentFailed(
                  headers,
                  paymentData.razorPay.razorpayOrderId,
                  'user_cancelled',
                  'Payment cancelled by user'
                );
                showSnackbar('Payment cancelled', 'info');
              } catch (error) {
                console.error('Error processing payment cancellation:', error);
              }
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.contact
          },
          notes: {
            course_id: courseId.toString(),
            seeker_id: user.seekerId.toString()
          },
          theme: {
            color: '#00afb5'
          }
        };

        // Create a new Razorpay instance and open the checkout modal
        console.log('Razorpay options:', options);
        const rzp1 = new window.Razorpay(options);
        console.log('Razorpay instance created:', rzp1);
        
        try {
          rzp1.open();
        } catch (rzpError) {
          console.error('Razorpay open error:', rzpError);
          showSnackbar('Failed to open payment window. Please try again.', 'error');
        }
        
      } else {
        showSnackbar('Error: Could not create payment order.', 'error');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      showSnackbar('Payment initiation failed! Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (courseId) => {
    // Navigate to a detailed view of the course or expand the description
    navigate(`/course-details/${courseId}`);
  };

  const toggleBookmark = (courseId) => {
    setBookmarkedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const toggleFavorite = (courseId) => {
    setFavoriteCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  return (
    <>
      {/* Modern Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '350px',
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
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            animation: 'float 25s ease-in-out infinite reverse'
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, height: '380px', display: 'flex', alignItems: 'center' }}>
          <Fade in timeout={1200}>
            <Box sx={{ textAlign: 'center', color: 'white', width: '100%' }}>
              {/* Floating Icon */}
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  mb: 3
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(20px)',
                    border: '3px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}
                >
                  <School sx={{ fontSize: 50, color: 'white' }} />
                </Avatar>
              </Box>

              {/* Title */}
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: 'linear-gradient(45deg, #ffffff, #f0f8ff, #ffffff)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  letterSpacing: '-0.02em'
                }}
              >
                {categoryName} Courses
              </Typography>

              {/* Subtitle */}
              <Typography 
                variant="h5" 
                sx={{ 
                  opacity: 0.95,
                  fontWeight: 400,
                  maxWidth: '700px',
                  mx: 'auto',
                  mb: 3,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  lineHeight: 1.6
                }}
              >
                Master your skills with our comprehensive {categoryName.toLowerCase()} course collection
              </Typography>

              {/* Stats */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={4} 
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {details.length}+
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Courses Available
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    4.8★
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Average Rating
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    10k+
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Students Enrolled
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Loading Skeleton */}
        {dataLoading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((index) => (
              <Grid item xs={12} key={index}>
                <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  <Grid container>
                    <Grid item xs={12} md={5}>
                      <Skeleton variant="rectangular" height={300} />
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <CardContent sx={{ p: 3 }}>
                        <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
                        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="text" height={20} sx={{ mb: 3, width: '60%' }} />
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                          <Skeleton variant="rectangular" height={24} width={60} />
                          <Skeleton variant="rectangular" height={24} width={80} />
                          <Skeleton variant="rectangular" height={24} width={100} />
                        </Box>
                        <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {(showAll ? details : details.slice(0, 4)).map((detail, index) => (
              <Grid item xs={12} key={detail.courseId}>
                <Zoom in timeout={500 + index * 100}>
                <Card
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
                    position: 'relative',
                    minHeight: '160px',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      '& .course-image': {
                        transform: 'scale(1.02)'
                      },
                      '& .course-overlay': {
                        opacity: 1
                      },
                      '& .course-actions': {
                        opacity: 1,
                        transform: 'translateY(0)'
                      }
                    }
                  }}
                >
                  <Grid container sx={{ height: '100%', alignItems: 'stretch' }}>
                    {/* Video/Image Section */}
                    <Grid item xs={12} md={5} sx={{ display: 'flex' }}>
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          minHeight: '160px',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {detail.videoUrl && isCoursePurchased(detail.courseId) ? (
                          <Box
                            className="course-image"
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              transition: 'transform 0.4s ease'
                            }}
                          >
                            <YouTubePlayer
                              videoUrl={detail.videoUrl}
                              title={`Course Preview: ${detail.courseName}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                border: 'none'
                              }}
                            />
                          </Box>
                        ) : detail.videoUrl ? (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
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
                              <Lock sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', opacity: 0.9 }}>
                                Course Locked
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '100%',
                              color: 'white',
                              position: 'relative'
                            }}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(20px)',
                                border: '2px solid rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <PlayCircleOutline sx={{ fontSize: 50, opacity: 0.9 }} />
                            </Box>
                          </Box>
                        )}
                        
                        {/* Hover Overlay - Only show for purchased courses */}
                        {isCoursePurchased(detail.courseId) && (
                          <Box
                            className="course-overlay"
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'rgba(0,0,0,0.4)',
                              opacity: 0,
                              transition: 'opacity 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <IconButton
                              sx={{
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                  background: 'rgba(255,255,255,1)',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <PlayCircleOutline sx={{ fontSize: 40, color: 'primary.main' }} />
                            </IconButton>
                          </Box>
                        )}
                        
                        {/* Discount Badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                            borderRadius: 2,
                            px: 1.5,
                            py: 0.5,
                            boxShadow: '0 2px 8px rgba(255,107,107,0.3)'
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'white', fontSize: '0.75rem' }}>
                            {detail.discount}% OFF
                          </Typography>
                        </Box>

                        {/* Course Actions */}
                        <Box
                          className="course-actions"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            opacity: 0,
                            transform: 'translateY(-10px)',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            gap: 0.5
                          }}
                        >
                          <IconButton
                            size="small"
                            sx={{
                              background: 'rgba(255,255,255,0.9)',
                              backdropFilter: 'blur(10px)',
                              '&:hover': {
                                background: 'rgba(255,255,255,1)',
                                transform: 'scale(1.1)'
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(detail.courseId);
                            }}
                          >
                            {bookmarkedCourses.has(detail.courseId) ? 
                              <Bookmark sx={{ fontSize: 20, color: 'primary.main' }} /> : 
                              <BookmarkBorder sx={{ fontSize: 20, color: 'text.secondary' }} />
                            }
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              background: 'rgba(255,255,255,0.9)',
                              backdropFilter: 'blur(10px)',
                              '&:hover': {
                                background: 'rgba(255,255,255,1)',
                                transform: 'scale(1.1)'
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(detail.courseId);
                            }}
                          >
                            {favoriteCourses.has(detail.courseId) ? 
                              <Favorite sx={{ fontSize: 20, color: '#ff6b6b' }} /> : 
                              <FavoriteBorder sx={{ fontSize: 20, color: 'text.secondary' }} />
                            }
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Course Details Section */}
                    <Grid item xs={12} md={7} sx={{ display: 'flex', minHeight: '160px' }}>
                      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {/* Header */}
                        <Box sx={{ mb: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700, 
                                color: 'text.primary',
                                lineHeight: 1.2,
                                flex: 1,
                                mr: 2,
                                fontSize: { xs: '1rem', md: '1.1rem' }
                              }}
                            >
                              {detail.courseName}
                            </Typography>
                            {alreadyPurchasedCourses.has(detail.courseId) ? (
                              <Chip
                                icon={<CheckCircle />}
                                label="Purchased"
                                color="success"
                                size="small"
                                sx={{ 
                                  fontWeight: 600,
                                  background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                                  color: 'white',
                                  boxShadow: '0 1px 4px rgba(76,175,80,0.3)',
                                  fontSize: '0.7rem',
                                  height: '20px'
                                }}
                              />
                            ) : (
                              <Chip
                                icon={<Lock />}
                                label="Locked"
                                size="small"
                                sx={{ 
                                  fontWeight: 600,
                                  background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                                  color: 'white',
                                  boxShadow: '0 1px 4px rgba(255,107,107,0.3)',
                                  fontSize: '0.7rem',
                                  height: '20px'
                                }}
                              />
                            )}
                          </Box>
                          
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary',
                              lineHeight: 1.4,
                              mb: 1.5,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              fontSize: '0.8rem'
                            }}
                          >
                            {detail.description}
                          </Typography>
                        </Box>

                        {/* Course Stats */}
                        <Box sx={{ mb: 1.5 }}>
                          <Stack direction="row" spacing={1.5} sx={{ mb: 0.5, flexWrap: 'wrap' }}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.3,
                              background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                              borderRadius: 1,
                              px: 1,
                              py: 0.3,
                              boxShadow: '0 1px 3px rgba(255,215,0,0.2)'
                            }}>
                              <Star sx={{ fontSize: 12, color: '#ff6b35' }} />
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#333', fontSize: '0.7rem' }}>
                                4.8
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.3,
                              background: 'linear-gradient(45deg, #667eea, #764ba2)',
                              borderRadius: 1,
                              px: 1,
                              py: 0.3,
                              boxShadow: '0 1px 3px rgba(102,126,234,0.2)'
                            }}>
                              <AccessTime sx={{ fontSize: 12, color: 'white' }} />
                              <Typography variant="caption" sx={{ fontWeight: 600, color: 'white', fontSize: '0.7rem' }}>
                                8 Hours
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.3,
                              background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                              borderRadius: 1,
                              px: 1,
                              py: 0.3,
                              boxShadow: '0 1px 3px rgba(76,175,80,0.2)'
                            }}>
                              <People sx={{ fontSize: 12, color: 'white' }} />
                              <Typography variant="caption" sx={{ fontWeight: 600, color: 'white', fontSize: '0.7rem' }}>
                                1.2k Students
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>

                        {/* Price Section */}
                        <Box sx={{ mb: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                color: 'primary.main', 
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: { xs: '1.2rem', md: '1.3rem' }
                              }}
                            >
                              ₹{detail.sellingPrice}
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: 'text.secondary', 
                                textDecoration: 'line-through',
                                fontWeight: 400,
                                opacity: 0.7,
                                fontSize: '0.9rem'
                              }}
                            >
                              ₹{detail.courseMrp}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.3,
                              background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                              color: 'white',
                              borderRadius: 1.5,
                              px: 1.5,
                              py: 0.3,
                              fontWeight: 600,
                              boxShadow: '0 1px 4px rgba(255,107,107,0.3)',
                              fontSize: '0.7rem'
                            }}
                          >
                            <TrendingUp sx={{ fontSize: 12 }} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              Save ₹{detail.courseMrp - detail.sellingPrice}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              flex: 0.7,
                              py: 1,
                              fontWeight: 600,
                              borderRadius: 1.5,
                              fontSize: '0.8rem',
                              background: alreadyPurchasedCourses.has(detail.courseId) 
                                ? 'linear-gradient(45deg, #4caf50, #8bc34a)' 
                                : 'linear-gradient(45deg, #667eea, #764ba2)',
                              boxShadow: alreadyPurchasedCourses.has(detail.courseId)
                                ? '0 2px 8px rgba(76,175,80,0.3)'
                                : '0 2px 8px rgba(102,126,234,0.3)',
                              '&:hover': {
                                boxShadow: alreadyPurchasedCourses.has(detail.courseId)
                                  ? '0 3px 10px rgba(76,175,80,0.4)'
                                  : '0 3px 10px rgba(102,126,234,0.4)',
                                transform: 'translateY(-1px)',
                                background: alreadyPurchasedCourses.has(detail.courseId) 
                                  ? 'linear-gradient(45deg, #45a049, #7cb342)' 
                                  : 'linear-gradient(45deg, #5a6fd8, #6a4190)'
                              },
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              textTransform: 'none'
                            }}
                            disabled={loading}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (alreadyPurchasedCourses.has(detail.courseId)) {
                                navigate('/upSkills/my-courses');
                              } else {
                                handleSubscribe(detail.sellingPrice, detail.courseId);
                              }
                            }}
                          >
                            {loading ? 'Processing...' : 
                             alreadyPurchasedCourses.has(detail.courseId) ? 'View Course' : 'Enroll Now'}
                          </Button>
                          
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              px: 1.5,
                              py: 1,
                              fontWeight: 600,
                              borderRadius: 1.5,
                              borderColor: '#667eea',
                              color: '#667eea',
                              borderWidth: 1,
                              fontSize: '0.8rem',
                              minWidth: '40px',
                              '&:hover': {
                                borderColor: '#667eea',
                                background: 'rgba(102,126,234,0.1)',
                                transform: 'translateY(-1px)',
                                borderWidth: 1
                              },
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              textTransform: 'none'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCourseDetails(detail.courseId);
                            }}
                          >
                            <ArrowForward sx={{ fontSize: 16 }} />
                          </Button>
                        </Box>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
        )}

        {/* View All Button */}
        {!showAll && details.length > 4 && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleViewAll}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                borderColor: '#667eea',
                color: '#667eea',
                borderWidth: 1.5,
                fontSize: '1rem',
                background: 'rgba(102,126,234,0.05)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  borderColor: '#667eea',
                  background: 'rgba(102,126,234,0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 5px 15px rgba(102,126,234,0.2)',
                  borderWidth: 1.5
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'none'
              }}
            >
              View All {details.length} Courses
            </Button>
          </Box>
        )}
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
};

export default CourseDetails;