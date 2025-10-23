import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// project imports
import { gridSpacing } from 'store/constant';
import Banner from 'views/dashboard/Banner';
import Categories from '../dashboard/Category';
import McqCategory from '../dashboard/McqCategory';

// ==============================|| CLEAN UP SKILLS DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Box sx={{ 
      background: '#f8fafc',
      minHeight: '100vh',
      padding: '24px'
    }}>
      <Grid container spacing={3}>
        {/* Banner Section */}
        <Grid item xs={12}>
          <Banner isLoading={isLoading} />
        </Grid>
        
        {/* Categories Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            height: 'fit-content'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '2px solid #f1f5f9'
            }}>
              <Box sx={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <Typography sx={{ color: 'white', fontSize: '20px' }}>📚</Typography>
              </Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                color: '#1e293b',
                fontSize: '1.5rem'
              }}>
                Courses
              </Typography>
            </Box>
            <Categories />
          </Box>
        </Grid>

        {/* MCQ Tests Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            height: 'fit-content'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '2px solid #f1f5f9'
            }}>
              <Box sx={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <Typography sx={{ color: 'white', fontSize: '20px' }}>❓</Typography>
              </Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                color: '#1e293b',
                fontSize: '1.5rem'
              }}>
                MCQ Tests
              </Typography>
            </Box>
            <McqCategory />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;