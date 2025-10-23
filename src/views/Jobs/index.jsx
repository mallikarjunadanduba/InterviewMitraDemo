import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';

// icons
import {
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
  VideoCall as VideoCallIcon,
  Description as DescriptionIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

// project imports
import { BaseUrl } from 'BaseUrl';

// Keyframes for animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '24px',
  padding: theme.spacing(6),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    animation: `${float} 20s ease-in-out infinite`
  }
}));

const StatCard = styled(Card)(({ theme }) => ({
  background: 'white',
  borderRadius: '20px',
  padding: theme.spacing(3),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    border: '1px solid rgba(102, 126, 234, 0.2)'
  }
}));

const JobCard = styled(Card)(({ theme }) => ({
  background: 'white',
  borderRadius: '16px',
  padding: theme.spacing(3),
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  border: '1px solid rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  marginBottom: theme.spacing(2),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    border: '1px solid rgba(102, 126, 234, 0.2)'
  }
}));

const QuickActionCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(0,0,0,0.05)',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    '& .MuiSvgIcon-root': {
      color: 'white'
    },
    '& .MuiTypography-root': {
      color: 'white'
    }
  }
}));

const Jobs = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [displayName, setDisplayName] = useState('');

  // Mock data - replace with real API calls
  const stats = {
    totalApplications: 24,
    interviews: 8,
    offers: 3,
    profileViews: 156,
    successRate: 87
  };

  const recentJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      status: 'Applied',
      date: '2 days ago',
      type: 'Full-time',
      logo: '🏢'
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$100k - $130k',
      status: 'Interview',
      date: '1 week ago',
      type: 'Full-time',
      logo: '🚀'
    },
    {
      id: 3,
      title: 'React Developer',
      company: 'BigTech Solutions',
      location: 'New York, NY',
      salary: '$110k - $140k',
      status: 'Applied',
      date: '3 days ago',
      type: 'Full-time',
      logo: '💼'
    },
    {
      id: 4,
      title: 'JavaScript Developer',
      company: 'WebSolutions',
      location: 'Austin, TX',
      salary: '$90k - $120k',
      status: 'Offer',
      date: '1 week ago',
      type: 'Full-time',
      logo: '🌐'
    }
  ];

  const quickActions = [
    {
      title: 'Find Jobs',
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      color: '#667eea',
      action: () => navigate('/jobs/search')
    },
    {
      title: 'Practice Interview',
      icon: <VideoCallIcon sx={{ fontSize: 40 }} />,
      color: '#764ba2',
      action: () => navigate('/jobs/interview-preparation')
    },
    {
      title: 'Take Assessment',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      color: '#f093fb',
      action: () => navigate('/jobs/tests')
    },
    {
      title: 'Update Resume',
      icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
      color: '#4facfe',
      action: () => navigate('/jobs/profile')
    }
  ];

  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    if (loggedInUser && loggedInUser.accessToken) {
      setUserName(loggedInUser.userName);
      setDisplayName(loggedInUser.userName); // Set initial fallback
      fetchUserInfo(loggedInUser.userName, loggedInUser.accessToken);
    }
    setLoading(false);
  }, []);

  const fetchUserInfo = async (userName, accessToken) => {
    try {
      const response = await axios.get(
        `${BaseUrl}/login/v1/queryUserProfileByUserName/${userName}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUserInfo(response.data);
      
      // Extract display name from user profile
      if (response.data && response.data.basicInfo) {
        const basicInfo = response.data.basicInfo;
        const name = basicInfo.firstName && basicInfo.lastName 
          ? `${basicInfo.firstName} ${basicInfo.lastName}`.trim()
          : basicInfo.firstName || basicInfo.lastName || userName;
        setDisplayName(name);
      } else {
        setDisplayName(userName);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setDisplayName(userName);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return '#667eea';
      case 'Interview': return '#f093fb';
      case 'Offer': return '#4facfe';
      case 'Rejected': return '#ff6b6b';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied': return '📝';
      case 'Interview': return '📞';
      case 'Offer': return '🎉';
      case 'Rejected': return '❌';
      default: return '⏳';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <Typography variant="h4" sx={{ color: '#667eea' }}>
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      py: 4,
      px: 2
    }}>
      <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroSection>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' }
                }}>
                  Welcome back !
                </Typography>
                <Typography variant="h6" sx={{ 
                  opacity: 0.9, 
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.6
                }}>
                  Your job search journey continues. Track your progress, 
                  practice your skills, and land your dream job.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    sx={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: '25px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.3)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                    startIcon={<SearchIcon />}
                  >
                    Find New Jobs
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.5)',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: '25px',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255,255,255,0.1)'
                      }
                    }}
                    startIcon={<AssessmentIcon />}
                  >
                    Take Assessment
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Box sx={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  p: 4,
                  display: 'inline-block',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.2)'
                }}>
                  <Typography variant="h1" sx={{ 
                    fontWeight: 900, 
                    fontSize: { xs: '3rem', md: '4rem' },
                    mb: 0
                  }}>
                    {stats.totalApplications}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ 
                  mt: 2,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  Applications Sent
                </Typography>
              </Grid>
            </Grid>
          </HeroSection>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <StatCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    p: 1.5,
                    mr: 2
                  }}>
                    <WorkIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800, 
                      color: '#2d3748',
                      mb: 0
                    }}>
                      {stats.totalApplications}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#718096',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '0.75rem'
                    }}>
                      Applications
                    </Typography>
                  </Box>
                </Box>
              </StatCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <StatCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '12px',
                    p: 1.5,
                    mr: 2
                  }}>
                    <VideoCallIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800, 
                      color: '#2d3748',
                      mb: 0
                    }}>
                      {stats.interviews}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#718096',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '0.75rem'
                    }}>
                      Interviews
                    </Typography>
                  </Box>
                </Box>
              </StatCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <StatCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    borderRadius: '12px',
                    p: 1.5,
                    mr: 2
                  }}>
                    <CheckCircleIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800, 
                      color: '#2d3748',
                      mb: 0
                    }}>
                      {stats.offers}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#718096',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '0.75rem'
                    }}>
                      Offers
                    </Typography>
                  </Box>
                </Box>
              </StatCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <StatCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    borderRadius: '12px',
                    p: 1.5,
                    mr: 2
                  }}>
                    <TrendingUpIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800, 
                      color: '#2d3748',
                      mb: 0
                    }}>
                      {stats.successRate}%
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#718096',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '0.75rem'
                    }}>
                      Success Rate
                    </Typography>
                  </Box>
                </Box>
              </StatCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <StatCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    borderRadius: '12px',
                    p: 1.5,
                    mr: 2
                  }}>
                    <StarIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 800, 
                      color: '#2d3748',
                      mb: 0
                    }}>
                      {stats.profileViews}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#718096',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '0.75rem'
                    }}>
                      Profile Views
                    </Typography>
                  </Box>
                </Box>
              </StatCard>
            </motion.div>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Recent Applications */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card sx={{ 
                background: 'white',
                borderRadius: '20px',
                padding: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    p: 1.5,
                    mr: 2
                  }}>
                    <WorkIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: '#2d3748'
                  }}>
                    Recent Applications
                  </Typography>
                </Box>
                
                <Box sx={{ maxHeight: '500px', overflow: 'auto' }}>
                  {recentJobs.map((job, index) => (
                    <JobCard key={job.id}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                          borderRadius: '12px',
                          p: 2,
                          minWidth: '60px',
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px'
                        }}>
                          {job.logo}
                        </Box>
                        
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700, 
                              color: '#2d3748',
                              fontSize: '1.1rem'
                            }}>
                              {job.title}
                            </Typography>
                            <Chip
                              label={job.status}
                              size="small"
                              sx={{
                                background: getStatusColor(job.status),
                                color: 'white',
                                fontWeight: 600,
                                borderRadius: '20px',
                                textTransform: 'uppercase',
                                fontSize: '0.75rem'
                              }}
                            />
                          </Box>
                          
                          <Typography variant="body1" sx={{ 
                            color: '#4a5568', 
                            fontWeight: 600,
                            mb: 1
                          }}>
                            {job.company}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocationIcon sx={{ fontSize: 16, color: '#718096' }} />
                              <Typography variant="body2" sx={{ color: '#718096' }}>
                                {job.location}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <MoneyIcon sx={{ fontSize: 16, color: '#718096' }} />
                              <Typography variant="body2" sx={{ color: '#718096' }}>
                                {job.salary}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ScheduleIcon sx={{ fontSize: 16, color: '#718096' }} />
                              <Typography variant="body2" sx={{ color: '#718096' }}>
                                {job.date}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </JobCard>
                  ))}
                </Box>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: '25px',
                      textTransform: 'none',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    View All Applications
                  </Button>
                </Box>
              </Card>
            </motion.div>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card sx={{ 
                background: 'white',
                borderRadius: '20px',
                padding: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)',
                height: '100%'
              }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: '#2d3748',
                  mb: 3,
                  textAlign: 'center'
                }}>
                  Quick Actions
                </Typography>
                
                <Grid container spacing={2}>
                  {quickActions.map((action, index) => (
                    <Grid item xs={6} key={index}>
                      <QuickActionCard onClick={action.action}>
                        <Box sx={{ 
                          color: action.color,
                          mb: 2,
                          transition: 'all 0.3s ease'
                        }}>
                          {action.icon}
                        </Box>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 600,
                          color: '#4a5568',
                          transition: 'all 0.3s ease'
                        }}>
                          {action.title}
                        </Typography>
                      </QuickActionCard>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Jobs;