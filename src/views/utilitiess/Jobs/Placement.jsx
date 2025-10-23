import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip
} from '@mui/material';
import {
  Business,
  PeopleAlt,
  Article,
  Schedule,
  ArrowForward,
  WorkOutline,
  Group,
  LocalOffer,
  Star
} from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';

const placementSections = [
  {
    title: 'Company Profiles',
    description: 'Detailed insights on tech companies and hiring patterns.',
    icon: <Business fontSize="large" color="primary" />,
    actionLabel: 'Explore Companies'
  },
  {
    title: 'Recruitment Rounds',
    description: 'Understand the structure of technical and HR rounds.',
    icon: <PeopleAlt fontSize="large" color="success" />,
    actionLabel: 'View Rounds'
  },
  {
    title: 'Interview Experiences',
    description: 'Read real-world interview stories shared by students.',
    icon: <Article fontSize="large" color="warning" />,
    actionLabel: 'Read Experiences'
  },
  {
    title: 'Upcoming Drives',
    description: 'Track upcoming placement drives and important dates.',
    icon: <Schedule fontSize="large" color="error" />,
    actionLabel: 'Check Schedule'
  }
];

const placementHistory = [
  {
    label: 'Applications Submitted',
    count: 28,
    icon: <WorkOutline fontSize="large" color="primary" />
  },
  {
    label: 'Interviews Attended',
    count: 12,
    icon: <Group fontSize="large" color="success" />
  },
  {
    label: 'Offers Received',
    count: 4,
    icon: <LocalOffer fontSize="large" color="warning" />
  },
  {
    label: 'Shortlisted Companies',
    count: 9,
    icon: <Star fontSize="large" color="error" />
  }
];

const Placement = () => {
  return (
    <MainCard sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
      {/* Main Heading */}
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 1,
          textTransform: 'uppercase',
          letterSpacing: 1
        }}
      >
        Placement Dashboard
      </Typography>

      <Typography
        variant="subtitle1"
        textAlign="center"
        sx={{
          mb: 4,
          color: 'text.secondary',
          maxWidth: 700,
          mx: 'auto',
          lineHeight: 1.6
        }}
      >
        Explore career opportunities, recruitment insights, and company-specific resources.
      </Typography>

      {/* Section: Placement Navigation Cards */}
      <Grid container spacing={4}>
        {placementSections.map((section, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={4}
              sx={{
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                {section.icon}
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {section.title}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {section.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<ArrowForward />}
                >
                  {section.actionLabel}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Section: Placement History */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h5"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'text.primary', mb: 3 }}
        >
          Your Placement History
        </Typography>

        <Grid container spacing={4}>
          {placementHistory.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={2}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                {item.icon}
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {item.count}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {item.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </MainCard>
  );
};

export default Placement;
