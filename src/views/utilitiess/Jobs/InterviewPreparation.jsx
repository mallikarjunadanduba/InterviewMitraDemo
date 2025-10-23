import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, CardActions, Divider, Chip, Container
} from '@mui/material';
import {
  ArrowForward, CheckCircle, Lightbulb
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

// Import custom icons
import MCQIcon from 'assets/images/InterviewPrepare/MCQs.png';
import SAQIcon from 'assets/images/InterviewPrepare/SAQs.png';
import CodingIcon from 'assets/images/InterviewPrepare/coding copy.png';
import BulbIcon from 'assets/images/InterviewPrepare/bulb.png';
import BannerRight from 'assets/images/InterviewPrepare/bannerimage.png';
import StatIcon1 from 'assets/images/InterviewPrepare/1st.png';
import StatIcon2 from 'assets/images/InterviewPrepare/2nd.png';
import StatIcon3 from 'assets/images/InterviewPrepare/3rd.png';
import TrustedIcon from 'assets/images/InterviewPrepare/badgeicon.png';

// Removed API-driven banner in favor of static banner

const assessmentCards = [
  {
    title: 'MCQs',
    subtitle: 'Multiple Choice Questions',
    description: 'Test your knowledge with multiple choice questions covering various topics and skills.',
    icon: MCQIcon,
    actionLabel: "Start MCQ's",
    path: '/jobs/practice-instructions',
    color: '#2563EB',
    bgColor: '#E0F2FE'
  },
  {
    title: 'SAQs',
    subtitle: 'Short Answer Questions',
    description: 'Demonstrate your understanding through concise written responses and explanations.',
    icon: SAQIcon,
    actionLabel: "Start SAQ's",
    path: '/jobs/short-answers-upskill-practice',
    color: '#7C3AED',
    bgColor: '#EDE9FE'
  },
  {
    title: 'Coding Snippets',
    subtitle: 'Try small code snippets',
    description: 'Showcase your programming skills and problem-solving abilities through coding challenges.',
    icon: CodingIcon,
    actionLabel: 'Start Coding',
    path: '/jobs/coding-upskill-practice',
    color: '#07BED6',
    bgColor: '#E0F7FA'
  }
];

const InterviewPreparation = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);

  const handleStartAssessment = (path) => {
    navigate(path);
  };

  return (
    <MainCard>
      {/* Static Banner - as per provided design */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 1, md: 1 }, mb: { xs: 1.5, md: 2 }, px: { xs: 1, sm: 2 } }}>
        <MainCard 
          border={false} 
          content={false} 
          sx={{ 
            width: '100%',
            maxWidth: 1200,
            height: { xs: 500, md: 305 }, 
            borderRadius: '10px', 
            overflow: 'hidden',
            border: '1px solid #FFFFFF'
          }}
        >
          {/* Desktop Layout */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(272.3deg, #90E0EF 0.09%, #1bb9ea 99.91%)',
              borderRadius: '10px',
              px: { xs: 2, sm: 3, md: 4 },
              pt: { xs: 3, sm: 3.5, md: 5 },
              pb: { xs: 2, sm: 2.5, md: 3 },
              position: 'relative',
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3
            }}
          >
            {/* Desktop Left Content */}
          <Box sx={{ flex: '0 0 60%', maxWidth: 640, pr: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', position: 'relative', zIndex: 3 }}>
              {/* Trusted By Badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 260,
                      height: 39,
                      borderRadius: '30px',
                      background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF)',
                      boxShadow: `
                        0px 1px 1px 0px #0000001A,
                        0px 3px 3px 0px #00000017,
                        0px 6px 3px 0px #0000000D,
                        0px 10px 4px 0px #00000003,
                        0px 16px 5px 0px #00000000
                      `,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 2,
                      py: 1
                    }}
                  >
                  <Box
                    component="img"
                    src={TrustedIcon}
                    alt="Check"
                    sx={{ width: 16, height: 16, mr: 1 }}
                  />
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '124%',
                      letterSpacing: '1%',
                      color: '#03045E',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 500 }}>Trusted By </Box>
                    <Box component="span" sx={{ fontWeight: 700 }}>10,000+ Students</Box>
                  </Typography>
                </Box>
              </Box>

              {/* Main Heading */}
              <Typography
                sx={{ 
                  color: '#FFFFFF',
                  fontFamily: 'Roboto',
                  fontWeight: 600,
                  mb: { xs: 1, md: 1.5 }, 
                  lineHeight: '124%',
                  letterSpacing: '1%',
                  fontSize: { xs: '24px', sm: '28px', md: '32px' },
                  maxWidth: { xs: '100%', md: 499 }
                }}
              >
                Master Your Interview Skills with{' '}
                <Box component="span" sx={{ color: '#03045E' }}>AI Intelligence</Box>
              </Typography>

              {/* Description */}
              <Typography 
                sx={{ 
                  color: '#FFFFFF',
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  mb: { xs: 1.5, md: 2 }, 
                  fontSize: { xs: '14px', md: '16px' },
                  lineHeight: { xs: 1.4, md: 1.4 },
                  maxWidth: { xs: 520, md: 581 }
                }}
              >
                Get personalized feedback, practice with real interview questions, and boost your confidence with our comprehensive preparation platform
              </Typography>

              {/* Stats with Icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 3, rowGap: 1.5, flexWrap: { xs: 'wrap', md: 'nowrap' }, justifyContent: { xs: 'center', md: 'flex-start' }, mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, whiteSpace: 'nowrap' }}>
                  <Box component="img" src={StatIcon1} alt="Instant Feedback" sx={{ width: 20, height: 20 }} />
                  <Typography sx={{ color: '#FFFFFF', fontFamily: 'Roboto', fontWeight: 500, fontSize: { xs: '14px', md: '16px' }, lineHeight: '124%', letterSpacing: '1%', whiteSpace: 'nowrap' }}>Instant Feedback</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, whiteSpace: 'nowrap' }}>
                  <Box component="img" src={StatIcon2} alt="AI-Powered Analysis" sx={{ width: 20, height: 20 }} />
                  <Typography sx={{ color: '#FFFFFF', fontFamily: 'Roboto', fontWeight: 500, fontSize: { xs: '14px', md: '16px' }, lineHeight: '124%', letterSpacing: '1%', whiteSpace: 'nowrap' }}>AI-Powered Analysis</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, whiteSpace: 'nowrap' }}>
                  <Box component="img" src={StatIcon3} alt="Reports & Tracking" sx={{ width: 20, height: 20 }} />
                  <Typography sx={{ color: '#FFFFFF', fontFamily: 'Roboto', fontWeight: 500, fontSize: { xs: '14px', md: '16px' }, lineHeight: '124%', letterSpacing: '1%', whiteSpace: 'nowrap' }}>Reports & Tracking</Typography>
                </Box>
              </Box>
            </Box>

          {/* Desktop Right Illustration - absolute positioned to extend beyond bottom */}
          <Box sx={{ position: 'absolute', right: 0, bottom: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', zIndex: 1, pointerEvents: 'none' }}>
            <Box
              component="img"
              src={BannerRight}
              alt="Banner"
              sx={{ 
                height: 240,
                width: 'auto',
                objectFit: 'contain',
                objectPosition: 'right bottom',
                display: 'block'
              }}
            />
          </Box>
          </Box>

          {/* Mobile Layout - Stacked Content */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(272.3deg, #90E0EF 0.09%, #1bb9ea 99.91%)',
              borderRadius: '10px',
              display: { xs: 'flex', md: 'none' },
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              justifyContent: 'space-between'
            }}
          >
            {/* Mobile Content */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', px: 2, pt: 3, pb: 4, zIndex: 2, position: 'relative', flex: '0 0 auto' }}>
              {/* Trusted By Badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 260,
                      height: 39,
                      borderRadius: '30px',
                      background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF)',
                      boxShadow: `
                        0px 1px 1px 0px #0000001A,
                        0px 3px 3px 0px #00000017,
                        0px 6px 3px 0px #0000000D,
                        0px 10px 4px 0px #00000003,
                        0px 16px 5px 0px #00000000
                      `,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 2,
                      py: 1
                    }}
                  >
                  <Box
                    component="img"
                    src={TrustedIcon}
                    alt="Check"
                    sx={{ width: 16, height: 16, mr: 1 }}
                  />
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '124%',
                      letterSpacing: '1%',
                      color: '#03045E',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 500 }}>Trusted By </Box>
                    <Box component="span" sx={{ fontWeight: 700 }}>10,000+ Students</Box>
                  </Typography>
                </Box>
              </Box>

              {/* Main Heading */}
              <Typography
                sx={{ 
                  color: '#1F2937',
                  fontFamily: 'Roboto',
                  fontWeight: 600,
                  mb: 1.5, 
                  lineHeight: '124%',
                  letterSpacing: '1%',
                  fontSize: '24px',
                  maxWidth: '90%'
                }}
              >
                Master Your Interview Skills with{' '}
                <Box component="span" sx={{ color: '#05956B' }}>AI Intelligence</Box>
              </Typography>

              {/* Description */}
              <Typography 
                sx={{ 
                  color: '#404041',
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  mb: 2, 
                  fontSize: '14px',
                  lineHeight: 1.4,
                  maxWidth: '85%'
                }}
              >
                Get personalized feedback, practice with real interview questions, and boost your confidence with our comprehensive preparation platform
              </Typography>

              {/* Stats with Icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2, rowGap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
                  <Box component="img" src={StatIcon1} alt="Instant Feedback" sx={{ width: 18, height: 18 }} />
                  <Typography sx={{ color: '#000000', fontFamily: 'Roboto', fontWeight: 500, fontSize: '14px', lineHeight: '124%', letterSpacing: '1%', whiteSpace: 'nowrap' }}>Instant Feedback</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
                  <Box component="img" src={StatIcon2} alt="AI-Powered Analysis" sx={{ width: 18, height: 18 }} />
                  <Typography sx={{ color: '#000000', fontFamily: 'Roboto', fontWeight: 500, fontSize: '14px', lineHeight: '124%', letterSpacing: '1%', whiteSpace: 'nowrap' }}>AI-Powered Analysis</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
                  <Box component="img" src={StatIcon3} alt="Reports & Tracking" sx={{ width: 18, height: 18 }} />
                  <Typography sx={{ color: '#000000', fontFamily: 'Roboto', fontWeight: 500, fontSize: '14px', lineHeight: '124%', letterSpacing: '1%', whiteSpace: 'nowrap' }}>Reports & Tracking</Typography>
                </Box>
              </Box>
            </Box>

            {/* Mobile Image - positioned to fill remaining space */}
            <Box sx={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
              <Box
                component="img"
                src={BannerRight}
                alt="Banner"
                sx={{ 
                  height: '100%',
                  width: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center center',
                  display: 'block'
                }}
              />
            </Box>
          </Box>
        </MainCard>
      </Box>

      {/* Main Content Section */}
      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
        {/* Start Your Preparation Heading */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              fontWeight: 600,
              fontSize: '26px',
              lineHeight: '124%',
              letterSpacing: '1%',
              textAlign: 'center',
              verticalAlign: 'middle',
              background: 'linear-gradient(90deg, #111827 0%, #3D578D 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Start Your Preparation
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              fontWeight: 400,
              fontSize: { xs: '14px', sm: '15px', md: '16px' },
              lineHeight: '124%',
              letterSpacing: '1%',
              textAlign: 'center',
              verticalAlign: 'middle',
              color: '#6B7280',
              maxWidth: { xs: '100%', sm: 600, md: 800 },
              mx: 'auto',
              whiteSpace: { xs: 'normal', sm: 'nowrap' },
              px: { xs: 2, sm: 0 }
            }}
          >
            Select a format to practice and get instant insights into your strengths and areas of improvement
          </Typography>
        </Box>

        {/* Cards Section */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center" sx={{ px: { xs: 1, sm: 2 } }}>
          {assessmentCards.map((card, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                elevation={0}
                sx={{
                  width: { xs: '100%', sm: 280, md: 298 },
                  maxWidth: 298,
                  height: { xs: 'auto', sm: 360, md: 388 },
                  minHeight: { xs: 350, sm: 360, md: 388 },
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: { xs: '16px', sm: '18px', md: '20px' },
                  padding: 0,
                  background: '#FFFFFF',
                  opacity: 1,
                  boxShadow: `
                    0px 2px 5px 0px #0000001A,
                    0px 19px 12px 0px #0000000D,
                    0px 34px 14px 0px #00000003,
                    0px 54px 15px 0px #00000000
                  `,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    boxShadow: `
                      0px 4px 8px 0px #0000001A,
                      0px 24px 16px 0px #0000000D,
                      0px 40px 18px 0px #00000003,
                      0px 60px 20px 0px #00000000
                    `
                  }
                }}
              >
                {/* Top Image Section */}
                <Box
                  sx={{
                    width: '100%',
                    height: { xs: 160, sm: 140, md: 160 },
                    borderRadius: { xs: '16px 16px 0 0', sm: '18px 18px 0 0', md: '20px 20px 0 0' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    component="img"
                    src={card.icon}
                    alt={card.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>

                {/* Content Section */}
                <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Title */}
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontWeight: 600,
                      fontSize: { xs: '18px', sm: '19px', md: '20px' },
                      lineHeight: '124%',
                      letterSpacing: '1%',
                      color: card.color,
                      mb: { xs: 0.25, sm: 0.5 },
                      textAlign: 'left'
                    }}
                  >
                    {card.title}
                  </Typography>

                  {/* Subtitle */}
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontWeight: 400,
                      fontSize: { xs: '12px', sm: '13px', md: '14px' },
                      lineHeight: '124%',
                      letterSpacing: '1%',
                      color: card.color,
                      mb: { xs: 1.5, sm: 1.75, md: 2 },
                      textAlign: 'left'
                    }}
                  >
                    {card.subtitle}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontWeight: 400,
                      fontSize: { xs: '14px', sm: '15px', md: '16px' },
                      lineHeight: '124%',
                      letterSpacing: '1%',
                      color: '#4F5C77',
                      mb: { xs: 2, sm: 2.5, md: 3 },
                      flexGrow: 1,
                      textAlign: 'left'
                    }}
                  >
                    {card.description}
                  </Typography>

                  {/* Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Button
                      variant="contained"
                      onClick={() => handleStartAssessment(card.path)}
                      sx={{
                        width: { xs: '90%', sm: '85%', md: '80%' },
                        height: { xs: 40, sm: 42, md: 44 },
                        borderRadius: '8px',
                        background: card.color,
                        color: '#FFFFFF',
                        textTransform: 'none',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: { xs: '16px', sm: '18px', md: '20px' },
                        lineHeight: { xs: '18px', sm: '19px', md: '20px' },
                        letterSpacing: '0.35px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        boxShadow: '1px 1px 4px 0px #00000040',
                        '&:hover': {
                          background: card.color,
                          opacity: 0.9
                        }
                      }}
                    >
                      {card.actionLabel}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pro Tip Section */}
        <Box
          sx={{
            mt: { xs: 4, sm: 6, md: 8 },
            width: { xs: '100%', sm: '90%', md: 916 },
            maxWidth: 916,
            height: { xs: 'auto', sm: 82 },
            minHeight: { xs: 60, sm: 82 },
            p: { xs: 2, sm: 2.5, md: 3 },
            background: 'linear-gradient(90deg, #90E0EF 0%, #CAF0F8 100%)',
            borderRadius: { xs: '20px', sm: '30px', md: '40px' },
            border: '1px solid #000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 1.5, sm: 2 },
            opacity: 1,
            mx: 'auto',
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          <Box
            component="img"
            src={BulbIcon}
            alt="Pro Tip"
            sx={{
              width: { xs: 24, sm: 28, md: 32 },
              height: { xs: 24, sm: 28, md: 32 },
              objectFit: 'contain',
              flexShrink: 0
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: '#333',
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1rem' },
              lineHeight: { xs: 1.4, sm: 1.5, md: 1.5 }
            }}
          >
            <Box component="span" sx={{ fontWeight: 'bold' }}>Pro Tip:</Box> Not sure where to begin? Start with{' '}
            <Box component="span" sx={{ fontWeight: 'bold' }}>MCQs</Box> to warm up, then move to{' '}
            <Box component="span" sx={{ fontWeight: 'bold' }}>Coding</Box> for advanced practice.
          </Typography>
        </Box>
      </Container>
    </MainCard>
  );
};

export default InterviewPreparation;
