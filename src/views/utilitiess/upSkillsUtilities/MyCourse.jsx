import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
    useMediaQuery,
    useTheme,
    Alert,
    CircularProgress,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Container,
    Stack,
    Avatar,
    Rating,
    Fade,
    Zoom
} from '@mui/material';
import {
    IconArrowRight,
    IconEye,
    IconCalendar,
    IconCurrencyRupee
} from '@tabler/icons-react';
import {
    PlayCircleOutline,
    Star,
    AccessTime,
    People,
    School,
    CheckCircle
} from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import YouTubePlayer from 'ui-component/YouTubePlayer/YouTubePlayer';
import { getOrdersByJobSeeker, getOrderById } from 'views/API/MyCourseApi';
import { fetchCourseByCourseId } from 'views/API/UpskillsCategoryApi';

const MyCourse = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [videoDialog, setVideoDialog] = useState({ open: false, videoUrl: '', title: '' });
    const [detailsDialog, setDetailsDialog] = useState({ open: false, order: null, loading: false });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const user = JSON.parse(sessionStorage.getItem('user'));
    const headers = {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + user.accessToken
    };

    const fetchMyCourses = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get course orders for the current user
            const ordersResponse = await getOrdersByJobSeeker(headers, user.seekerId);
            const orders = ordersResponse.data;

            // Filter only successful payments
            const successfulOrders = orders.filter(order => order.paymentStatus === 'SUCCESS');

            // Fetch course details for each order
            const coursePromises = successfulOrders.map(async (order) => {
                try {
                    const courseResponse = await fetchCourseByCourseId(headers, order.course.courseId);
                    return {
                        ...courseResponse.data,
                        orderDetails: order,
                        purchaseDate: order.createdAt
                    };
                } catch (error) {
                    console.error(`Error fetching course ${order.course.courseId}:`, error);
                    return null;
                }
            });

            const courseResults = await Promise.all(coursePromises);
            const validCourses = courseResults.filter(course => course !== null);

            setCourses(validCourses);
        } catch (error) {
            console.error('Error fetching my courses:', error);
            setError('Failed to load your courses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.seekerId) {
            fetchMyCourses();
        } else {
            setError('User not found. Please login again.');
            setLoading(false);
        }
    }, []);

    const handleStartCourse = (course) => {
        if (course.videoUrl) {
            setVideoDialog({
                open: true,
                videoUrl: course.videoUrl,
                title: `Course Video: ${course.courseName}`
            });
        } else {
            setSnackbar({
                open: true,
                message: 'No video available for this course',
                severity: 'warning'
            });
        }
    };

    const handleViewDetails = async (course) => {
        try {
            setDetailsDialog({ open: true, order: null, loading: true });

            // Call the get order by ID API
            const response = await getOrderById(headers, course.orderDetails.orderId);
            const order = response.data;

            setDetailsDialog({ open: true, order: order, loading: false });
        } catch (error) {
            console.error('Error fetching order details:', error);
            setDetailsDialog({ open: true, order: null, loading: false });
            setSnackbar({
                open: true,
                message: 'Failed to fetch order details',
                severity: 'error'
            });
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'SUCCESS':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'FAILED':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <MainCard>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Loading your courses...
                    </Typography>
                </Box>
            </MainCard>
        );
    }

    if (error) {
        return (
            <MainCard>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={fetchMyCourses}>
                    Retry
                </Button>
            </MainCard>
        );
    }

    return (
        <>
            {/* Modern Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    minHeight: '250px',
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
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, height: '250px', display: 'flex', alignItems: 'center' }}>
                    <Fade in timeout={1200}>
                        <Box sx={{ textAlign: 'center', color: 'white', width: '100%' }}>
                            {/* Floating Icon */}
                            <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(20px)',
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        animation: 'pulse 2s ease-in-out infinite'
                                    }}
                                />
                                <Avatar
                                    sx={{
                                        width: 45,
                                        height: 45,
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(20px)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
                                    }}
                                >
                                    <School sx={{ fontSize: 24, color: 'white' }} />
                                </Avatar>
                            </Box>

                            {/* Title */}
                            <Typography 
                                variant="h3" 
                                sx={{ 
                                    fontWeight: 800, 
                                    mb: 0.5,
                                    fontSize: { xs: '1.5rem', md: '2rem' },
                                    background: 'linear-gradient(45deg, #ffffff, #f0f8ff, #ffffff)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    letterSpacing: '-0.02em'
                                }}
                            >
                                My Courses
                            </Typography>

                            {/* Subtitle */}
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    opacity: 0.95,
                                    fontWeight: 400,
                                    maxWidth: '500px',
                                    mx: 'auto',
                                    mb: 2,
                                    fontSize: { xs: '0.9rem', md: '1rem' },
                                    lineHeight: 1.5
                                }}
                            >
                                Continue your learning journey with your purchased courses
                            </Typography>

                            {/* Stats */}
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={3}
                                justifyContent="center"
                                sx={{ mt: 2 }}
                            >
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: '#ffd700', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                        {courses.length}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.8,  color: '#333333' }}>
                                        Courses Purchased
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: '#00d4aa', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                        100%
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.8,  color: '#333333' }}>
                                        Completion Rate
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: '#ff6b9d', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                        24/7
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.6, color: '#333333' }}>
                                        Access Available
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Fade>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 2 }}>

                {courses.length === 0 ? (
                    <Card
                        sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
                            border: '1px solid rgba(0,0,0,0.06)'
                        }}
                    >
                        <Box textAlign="center" py={4}>
                            <Avatar
                                sx={{
                                    width: 60,
                                    height: 60,
                                    mx: 'auto',
                                    mb: 2,
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    boxShadow: '0 6px 20px rgba(102,126,234,0.3)'
                                }}
                            >
                                <School sx={{ fontSize: 30, color: 'white' }} />
                            </Avatar>
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                No courses purchased yet
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontWeight: 400 }}>
                                Start your learning journey by exploring our courses
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/upSkills')}
                                sx={{
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    boxShadow: '0 6px 20px rgba(102,126,234,0.4)',
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    '&:hover': {
                                        boxShadow: '0 8px 25px rgba(102,126,234,0.5)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    textTransform: 'none'
                                }}
                            >
                                Browse Courses
                            </Button>
                        </Box>
                    </Card>
                ) : (
                    <Grid container spacing={2}>
                        {courses.map((course, index) => (
                            <Grid item xs={12} key={course.courseId}>
                                <Zoom in timeout={500 + index * 100}>
                                    <Card
                                        sx={{
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: '1px solid rgba(0,0,0,0.06)',
                                            background: 'linear-gradient(145deg, #ffffff 0%, #fafbfc 100%)',
                                            position: 'relative',
                                            minHeight: '200px',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                                                '& .course-image': {
                                                    transform: 'scale(1.03)'
                                                }
                                            }
                                        }}
                                    >
                                        <Grid container sx={{ height: '100%', alignItems: 'stretch' }}>
                                            {/* Video Section - Increased Size */}
                                            <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                                                <Box
                                                    sx={{
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '100%',
                                                        minHeight: '200px',
                                                        overflow: 'hidden',
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {course.videoUrl ? (
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
                                                                videoUrl={course.videoUrl}
                                                                title={`Course Preview: ${course.courseName}`}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    border: 'none'
                                                                }}
                                                            />
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

                                                    {/* Status Badge */}
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 20,
                                                            right: 20,
                                                            background: 'rgba(255,255,255,0.9)',
                                                            backdropFilter: 'blur(10px)',
                                                            borderRadius: 3,
                                                            px: 2,
                                                            py: 1
                                                        }}
                                                    >
                                                        <Chip
                                                            icon={<CheckCircle />}
                                                            label={course.orderDetails.paymentStatus}
                                                            color={getStatusColor(course.orderDetails.paymentStatus)}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 600,
                                                                fontSize: '0.75rem'
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Grid>

                                            {/* Course Details Section */}
                                            <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                                                <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                    {/* Header */}
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography
                                                            variant="h5"
                                                            sx={{
                                                                fontWeight: 700,
                                                                color: 'text.primary',
                                                                lineHeight: 1.3,
                                                                mb: 1.5,
                                                                fontSize: { xs: '1.1rem', md: '1.3rem' }
                                                            }}
                                                        >
                                                            {course.courseName}
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: 'text.secondary',
                                                                lineHeight: 1.5,
                                                                mb: 2,
                                                                fontSize: '0.9rem'
                                                            }}
                                                        >
                                                            {course.description}
                                                        </Typography>
                                                    </Box>

                                                    {/* Course Stats */}
                                                    <Box sx={{ mb: 2 }}>
                                                        <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, flexWrap: 'wrap' }}>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.3,
                                                                background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                                                                borderRadius: 1.5,
                                                                px: 1.5,
                                                                py: 0.5,
                                                                boxShadow: '0 1px 4px rgba(255,215,0,0.2)'
                                                            }}>
                                                                <Star sx={{ fontSize: 14, color: '#ff6b35' }} />
                                                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#333', fontSize: '0.75rem' }}>
                                                                    4.8
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.3,
                                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                                borderRadius: 1.5,
                                                                px: 1.5,
                                                                py: 0.5,
                                                                boxShadow: '0 1px 4px rgba(102,126,234,0.2)'
                                                            }}>
                                                                <AccessTime sx={{ fontSize: 14, color: 'white' }} />
                                                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'white', fontSize: '0.75rem' }}>
                                                                    8 Hours
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.3,
                                                                background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                                                                borderRadius: 1.5,
                                                                px: 1.5,
                                                                py: 0.5,
                                                                boxShadow: '0 1px 4px rgba(76,175,80,0.2)'
                                                            }}>
                                                                <People sx={{ fontSize: 14, color: 'white' }} />
                                                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'white', fontSize: '0.75rem' }}>
                                                                    1.2k Students
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Box>

                                                    {/* Course Info */}
                                                    <Box sx={{ mb: 2 }}>
                                                        <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.5,
                                                                background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                                                                borderRadius: 1.5,
                                                                px: 1.5,
                                                                py: 0.5,
                                                                boxShadow: '0 1px 4px rgba(76,175,80,0.2)'
                                                            }}>
                                                                <IconCurrencyRupee size={14} color="white" />
                                                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'white', fontSize: '0.75rem' }}>
                                                                    ₹{course.orderDetails.amountPaid}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.5,
                                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                                borderRadius: 1.5,
                                                                px: 1.5,
                                                                py: 0.5,
                                                                boxShadow: '0 1px 4px rgba(102,126,234,0.2)'
                                                            }}>
                                                                <IconCalendar size={14} color="white" />
                                                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'white', fontSize: '0.75rem' }}>
                                                                    {formatDate(course.purchaseDate)}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Box>

                                                    {/* Action Buttons */}
                                                    <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>
                                                        <Button
                                                            variant="contained"
                                                            size="medium"
                                                            sx={{
                                                                flex: 1,
                                                                py: 1.5,
                                                                fontWeight: 600,
                                                                borderRadius: 2,
                                                                fontSize: '0.9rem',
                                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                                boxShadow: '0 3px 12px rgba(102,126,234,0.3)',
                                                                '&:hover': {
                                                                    boxShadow: '0 5px 15px rgba(102,126,234,0.4)',
                                                                    transform: 'translateY(-2px)',
                                                                    background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
                                                                },
                                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                textTransform: 'none'
                                                            }}
                                                            onClick={() => handleStartCourse(course)}
                                                        >
                                                            <IconArrowRight size={16} style={{ marginRight: '6px' }} />
                                                            Start Course
                                                        </Button>

                                                        <Button
                                                            variant="outlined"
                                                            size="medium"
                                                            sx={{
                                                                px: 2,
                                                                py: 1.5,
                                                                fontWeight: 600,
                                                                borderRadius: 2,
                                                                borderColor: '#667eea',
                                                                color: '#667eea',
                                                                borderWidth: 1.5,
                                                                fontSize: '0.9rem',
                                                                '&:hover': {
                                                                    borderColor: '#667eea',
                                                                    background: 'rgba(102,126,234,0.1)',
                                                                    transform: 'translateY(-2px)',
                                                                    borderWidth: 1.5
                                                                },
                                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                textTransform: 'none'
                                                            }}
                                                            onClick={() => handleViewDetails(course)}
                                                        >
                                                            <IconEye size={16} style={{ marginRight: '6px' }} />
                                                            View Details
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
            </Container>

            {/* Video Dialog */}
            <Dialog
                open={videoDialog.open}
                onClose={() => setVideoDialog({ open: false, videoUrl: '', title: '' })}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: '#000',
                        color: '#fff'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#fff', borderBottom: '1px solid #333' }}>
                    {videoDialog.title}
                </DialogTitle>
                <DialogContent sx={{ padding: 0, backgroundColor: '#000' }}>
                    {videoDialog.videoUrl && (
                        <Box sx={{ width: '100%', height: '60vh' }}>
                            <YouTubePlayer
                                videoUrl={videoDialog.videoUrl}
                                title={videoDialog.title}
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#000', borderTop: '1px solid #333' }}>
                    <Button
                        onClick={() => setVideoDialog({ open: false, videoUrl: '', title: '' })}
                        sx={{ color: '#fff' }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Order Details Dialog */}
            <Dialog
                open={detailsDialog.open}
                onClose={() => setDetailsDialog({ open: false, order: null, loading: false })}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Order Details - {detailsDialog.order ? `Order #${detailsDialog.order.orderId}` : 'Loading...'}
                </DialogTitle>
                <DialogContent>
                    {detailsDialog.loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                            <CircularProgress />
                            <Typography variant="body1" sx={{ ml: 2 }}>
                                Loading order details...
                            </Typography>
                        </Box>
                    ) : detailsDialog.order ? (
                        <Box sx={{ mt: 2 }}>
                            {/* Order Information Card */}
                            <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#00afb5' }}>
                                        Order Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Order ID:</strong>
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                {detailsDialog.order.orderId}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Payment Status:</strong>
                                            </Typography>
                                            <Box sx={{ mb: 1 }}>
                                                <Chip
                                                    label={detailsDialog.order.paymentStatus}
                                                    color={getStatusColor(detailsDialog.order.paymentStatus)}
                                                    size="small"
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Amount Paid:</strong>
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', color: '#00afb5' }}>
                                                ₹{detailsDialog.order.amountPaid}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Payment Gateway:</strong>
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                {detailsDialog.order.paymentGateway}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Transaction ID:</strong>
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1, fontFamily: 'monospace' }}>
                                                {detailsDialog.order.transactionId || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Order Date:</strong>
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                {formatDate(detailsDialog.order.createdAt)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Course Information Card */}
                            {detailsDialog.order.course && (
                                <Card sx={{ border: '1px solid #e0e0e0' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#00afb5' }}>
                                            Course Information
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Course Name:</strong>
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                                    {detailsDialog.order.course.courseName}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Course Description:</strong>
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 1 }}>
                                                    {detailsDialog.order.course.description || 'No description available'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Course ID:</strong>
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 1 }}>
                                                    {detailsDialog.order.course.courseId}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    <strong>Course Price:</strong>
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', color: '#00afb5' }}>
                                                    ₹{detailsDialog.order.course.sellingPrice}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}
                        </Box>
                    ) : (
                        <Box textAlign="center" py={4}>
                            <Typography variant="body1" color="text.secondary">
                                No order details found.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDetailsDialog({ open: false, order: null, loading: false })}
                        variant="contained"
                        sx={{ backgroundColor: '#00afb5' }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
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
            `}</style>
        </>
    );
};

export default MyCourse;
