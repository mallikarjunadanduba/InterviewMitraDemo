import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import { motion } from 'framer-motion';

// project imports
import { gridSpacing } from 'store/constant';
import Categories from '../dashboard/Category';
import McqCategory from '../dashboard/McqCategory';

// ==============================|| CLEAN DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    
    // Add CSS keyframes for animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.8; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      padding: '24px'
    }}>
      <Grid container spacing={4}>
        {/* Welcome Hero Section */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{
              background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
              borderRadius: '24px',
              padding: '40px',
              color: '#1565c0',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #81d4fa',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                transform: 'translate(50%, -50%)'
              }
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h3" sx={{
                  fontWeight: 800,
                  marginBottom: '16px',
                  fontSize: { xs: '2rem', md: '3rem' },
                  color: '#0277bd'
                }}>
                  🚀 Ready to Ace Your Interview?
                </Typography>
                <Typography variant="h6" sx={{
                  marginBottom: '24px',
                  opacity: 0.8,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  color: '#1565c0'
                }}>
                  You've got this! Every expert was once a beginner. Let's turn your interview anxiety into interview confidence.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label="💪 You're Capable"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.6)',
                      color: '#0277bd',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      border: '1px solid rgba(2, 119, 189, 0.3)'
                    }}
                  />
                  <Chip
                    label="🎯 Practice Makes Perfect"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.6)',
                      color: '#0277bd',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      border: '1px solid rgba(2, 119, 189, 0.3)'
                    }}
                  />
                  <Chip
                    label="⭐ Success Awaits"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.6)',
                      color: '#0277bd',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      border: '1px solid rgba(2, 119, 189, 0.3)'
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        {/* Dashboard Cards */}
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexWrap: { xs: 'wrap', md: 'nowrap' }
          }}>
            {/* Practice Sessions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                y: [0, -5, 0]
              }}
              transition={{ 
                duration: 0.6, 
                delay: 0.2,
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <Card sx={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                width: '280px',
                height: '200px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  marginBottom: '16px',
                  color: '#03045e',
                  textAlign: 'center'
                }}>
                  🎯 Practice Sessions
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{
                    color: '#2a9d8f',
                    fontWeight: 700,
                    marginBottom: '8px'
                  }}>
                    24
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', marginBottom: '16px' }}>
                    Total Sessions
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>This Week</Typography>
                    <Typography variant="caption" sx={{ color: '#2a9d8f', fontWeight: 600 }}>5 sessions</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        background: '#2a9d8f',
                        borderRadius: '3px'
                      }
                    }}
                  />
                </Box>
              </Card>
            </motion.div>

            {/* Performance Score Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                y: [0, -8, 0]
              }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4,
                y: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <Card sx={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                width: '280px',
                height: '200px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  marginBottom: '16px',
                  color: '#03045e',
                  textAlign: 'center'
                }}>
                  📊 Performance Score
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{
                    color: '#03045e',
                    fontWeight: 700,
                    marginBottom: '8px'
                  }}>
                    92%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', marginBottom: '16px' }}>
                    Average Score
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Last Test</Typography>
                    <Typography variant="caption" sx={{ color: '#03045e', fontWeight: 600 }}>95%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={92}
                    sx={{
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        background: '#03045e',
                        borderRadius: '3px'
                      }
                    }}
                  />
                </Box>
              </Card>
            </motion.div>

            {/* Study Streak Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                y: [0, -6, 0]
              }}
              transition={{ 
                duration: 0.6, 
                delay: 0.6,
                y: {
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <Card sx={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                width: '280px',
                height: '200px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  marginBottom: '16px',
                  color: '#03045e',
                  textAlign: 'center'
                }}>
                  🔥 Study Streak
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{
                    color: '#2a9d8f',
                    fontWeight: 700,
                    marginBottom: '8px'
                  }}>
                    7
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', marginBottom: '16px' }}>
                    Days in a Row
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Best Streak</Typography>
                    <Typography variant="caption" sx={{ color: '#2a9d8f', fontWeight: 600 }}>15 days</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={47}
                    sx={{
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        background: '#2a9d8f',
                        borderRadius: '3px'
                      }
                    }}
                  />
                </Box>
              </Card>
            </motion.div>

            {/* Time Spent Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                y: [0, -7, 0]
              }}
              transition={{ 
                duration: 0.6, 
                delay: 0.8,
                y: {
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <Card sx={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                width: '280px',
                height: '200px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  marginBottom: '16px',
                  color: '#03045e',
                  textAlign: 'center'
                }}>
                  ⏱️ Time Spent
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{
                    color: '#03045e',
                    fontWeight: 700,
                    marginBottom: '8px'
                  }}>
                    42h
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', marginBottom: '16px' }}>
                    Total Study Time
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>This Week</Typography>
                    <Typography variant="caption" sx={{ color: '#03045e', fontWeight: 600 }}>8.5h</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={68}
                    sx={{
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        background: '#03045e',
                        borderRadius: '3px'
                      }
                    }}
                  />
                </Box>
              </Card>
            </motion.div>
          </Box>
        </Grid>

        {/* Motivational Quote */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card sx={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              border: '1px solid #f59e0b'
            }}>
              <Typography variant="h5" sx={{
                fontStyle: 'italic',
                color: '#92400e',
                fontWeight: 600,
                marginBottom: '16px'
              }}>
                "The only way to do great work is to love what you do.
                <br />
                And the only way to love what you do is to be great at it."
              </Typography>
              <Typography variant="body1" sx={{
                color: '#a16207',
                fontWeight: 500
              }}>
                — Steve Jobs
              </Typography>
            </Card>
          </motion.div>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;