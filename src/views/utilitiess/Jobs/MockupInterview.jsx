import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  CardActions,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Videocam as CameraIcon
} from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';
import { MockInterviewBaseUrl, MockInterviewEndpoints } from 'config/MockInterviewConfig';

const MockupInterview = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get user email from profile data
    const getUserEmail = async () => {
        try {
            const user = JSON.parse(sessionStorage.getItem("user"));
            if (!user?.seekerId) {
                return null;
            }

            const headers = {
                "Content-type": "application/json",
                Authorization: "Bearer " + user.accessToken
            };

            const jobSeekerId = parseInt(user.seekerId);
            const response = await fetch(
                `${BaseUrl}/jobseekerprofile/v1/getJobSeekerProfileByJobSeekerId/${jobSeekerId}`,
                { headers }
            );

            if (response.ok) {
                const profileData = await response.json();
                return profileData?.email || null;
            }
            return null;
        } catch (error) {
            console.error("Error getting user email:", error);
            return null;
        }
    };

    // Create interview session
    const createInterviewSession = async (email) => {
        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("question_mode", "predefined"); // Default to predefined mode
            formData.append("domain", "general"); // Change or dynamically set if needed

            const response = await fetch(`${MockInterviewBaseUrl}${MockInterviewEndpoints.CREATE_SESSION}`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                // Extract session ID using the same logic as InvitationForm
                const sessionId = data.session_id || data.sessionId || (typeof data.link === 'string' ? data.link.split('/').pop() : null);
                
                return {
                    success: true,
                    sessionId: sessionId,
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: data.error || 'Something went wrong!'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Network error occurred.'
            };
        }
    };


    const handleStartMockInterview = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const userEmail = await getUserEmail();
            
            if (!userEmail) {
                Swal.fire({
                    title: 'Email Required',
                    text: 'Please complete your profile with email address before starting the interview.',
                    icon: 'warning',
                    confirmButtonText: 'Go to Profile',
                    showCancelButton: true,
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/jobs/profile');
                    }
                });
                return;
            }

            const result = await createInterviewSession(userEmail);
            
            if (result.success) {
                Swal.fire({
                    title: 'Interview Link Sent!',
                    html: `
                    <p>An email with the mock interview link has been sent to <strong>${userEmail}</strong>.</p>
                    <p>Please check your email and click the link to start your interview.</p>
                    ${result.data.link ? `<p>Or click below to open it directly:</p><a href="${result.data.link}" target="_blank" style="color: #00AFB5; text-decoration: none;">${result.data.link}</a>` : ''}
                `,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    showCancelButton: true,
                    cancelButtonText: 'Close'
                });
            } else {
                setError(result.error);
                Swal.fire({
                    title: 'Error',
                    text: result.error,
                    icon: 'error'
                });
            }
        } catch (error) {
            setError(error.message);
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong. Please try again.',
                icon: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainCard>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 'bold',
                            color: '#00AFB5',
                            mb: 2,
                            textTransform: 'uppercase',
                            letterSpacing: 1
                        }}
                    >
                        AI Mock Interview Platform
                    </Typography>
                    
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                            color: 'text.secondary',
                            maxWidth: 800,
                            mx: 'auto',
                            lineHeight: 1.6
                        }}
                    >
                        Practice with cutting-edge AI technology featuring real-time face detection, 
                        speech analysis, and comprehensive performance reports.
                    </Typography>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                        <Alert severity="error" sx={{ maxWidth: 600, width: '100%' }}>
                            {error}
                        </Alert>
                    </Box>
                )}

                {/* Mock Interview Card */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                    <Card
                        elevation={3}
                        sx={{
                            width: { xs: '100%', sm: 500, md: 600 },
                            maxWidth: 600,
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.05) 0%, rgba(0, 180, 216, 0.1) 100%)',
                            border: '1px solid rgba(0, 180, 216, 0.2)'
                        }}
                    >
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                            <CameraIcon 
                                sx={{ 
                                    fontSize: 80, 
                                    color: '#00AFB5', 
                                    mb: 3,
                                    display: 'block',
                                    mx: 'auto'
                                }} 
                            />
                            
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#00AFB5',
                                    mb: 2
                                }}
                            >
                                Start Mock Interview
                            </Typography>
                            
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    mb: 4,
                                    lineHeight: 1.6
                                }}
                            >
                                Experience a realistic interview environment with AI-powered questions, 
                                real-time face detection, and comprehensive performance analysis.
                            </Typography>
                        </CardContent>
                        
                        <CardActions sx={{ justifyContent: 'center', pb: 4 }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleStartMockInterview}
                                disabled={isLoading}
                                sx={{
                                    backgroundColor: '#00AFB5',
                                    color: 'white',
                                    px: 6,
                                    py: 1.5,
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#0097a7'
                                    },
                                    '&:disabled': {
                                        backgroundColor: '#ccc'
                                    }
                                }}
                            >
                                {isLoading ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CircularProgress size={20} color="inherit" />
                                        Creating Session...
                                    </Box>
                                ) : (
                                    'Start Mock Interview'
                                )}
                            </Button>
                        </CardActions>
                    </Card>
                </Box>

            </Container>
        </MainCard>
    );
};

export default MockupInterview;
