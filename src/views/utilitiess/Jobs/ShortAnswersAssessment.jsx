import React from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, CardActions, Divider
} from '@mui/material';
import {
  ArrowForward,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import academicImage from 'assets/images/InterviewPrepare/academic.png';
import upskillsImage from 'assets/images/InterviewPrepare/upskills.png';

const shortAnswersCards = [
  {
    title: 'Academic',
    subtitle: 'Think Like a Scholar',
    description: 'Master the art of explaining complex concepts with clarity and precision that impresses even the toughest interviewers.',
    actionLabel: 'Start SAQ Practice',
    path: '/jobs/short-answers-academic-practice',
    color: '#2563EB',
    image: academicImage,
    background: 'rgba(37, 99, 235, 0.1)'
  },
  {
    title: 'Up Skills',
    subtitle: 'Speak Like a Pro',
    description: 'Transform your technical knowledge into compelling stories that showcase your expertise and win over hiring managers.',
    actionLabel: 'Start SAQ Practice',
    path: '/jobs/short-answers-upskill-practice',
    color: '#6D28D9',
    image: upskillsImage,
    background: 'rgba(109, 40, 217, 0.1)'
  }
];

const ShortAnswersAssessment = () => {
  const navigate = useNavigate();

  const handleStartPreparation = (path) => {
    navigate(path);
  };

  return (
    <MainCard>
      <Box sx={{ px: { xs: 1, md: 6 }, py: { xs: 3, md: 5 }, maxWidth: { xs: '100%', md: 1200 }, mx: 'auto' }}>

        {/* Main Heading */}
        <Typography
          variant="h3"
          textAlign="center"
          sx={{
            fontFamily: 'Roboto',
            fontWeight: 600,
            fontSize: '24px',
            lineHeight: '124%',
            letterSpacing: '1%',
            color: '#111827',
            mb: 0.5
          }}
        >
          Choose your SAQs Preparation Path
        </Typography>

        {/* Subtitle and Back Button Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Poppins',
              color: '#64748B',
              letterSpacing: '0.35px',
              lineHeight: '20px',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '8px 12px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Back
          </Button>

          {/* Centered Subtitle */}
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              color: '#6B7280',
              lineHeight: '124%',
              fontWeight: 400,
              fontSize: '16px',
              letterSpacing: '1%',
              fontFamily: 'Roboto',
              flex: 1
            }}
          >
            Select the type of questions that best match your goals
          </Typography>

          {/* Empty space to balance the layout */}
          <Box sx={{ width: 80 }} />
        </Box>

        {/* Gradient Divider */}
        <Box
          sx={{
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, #2563EB 0%, #6D28D9 100%)',
            mb: 6
          }}
        />

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: { xs: 2, sm: 4, md: 8, lg: 14 }, 
          flexWrap: 'wrap' 
        }}>
          {shortAnswersCards.map((card, index) => (
            <Card
              key={index}
              elevation={0}
              sx={{
                width: { xs: '100%', sm: '45%', md: 320 },
                maxWidth: 320,
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)'
                }
              }}
            >
              {/* Image Section */}
              <Box
                sx={{
                  height: 200,
                  background: card.background,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '24px 24px 0 0',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box
                  component="img"
                  src={card.image}
                  alt={card.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>

              {/* Content Section */}
              <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Title */}
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '1.2',
                    color: card.color,
                    mb: 1
                  }}
                >
                  {card.title}
                </Typography>

                {/* Subtitle */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: 'Roboto',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '1.4',
                    color: '#6B7280',
                    mb: 2
                  }}
                >
                  {card.subtitle}
                </Typography>
                
                {/* Description */}
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#6B7280',
                    mb: 3,
                    flexGrow: 1
                  }}
                >
                  {card.description}
                </Typography>

                {/* Button */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleStartPreparation(card.path)}
                  sx={{
                    width: '100%',
                    height: 48,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    fontFamily: 'Roboto',
                    backgroundColor: card.color,
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: card.color,
                      opacity: 0.9,
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  {card.actionLabel}
                </Button>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Bottom Banner */}
        <Box
          sx={{
            mt: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(90deg, #6D28D9 0%, #2563EB 100%)',
            borderRadius: '50px',
            py: 2,
            px: 3,
            maxWidth: 400,
            mx: 'auto'
          }}
        >
          <Typography
            sx={{
              color: 'white',
              fontSize: '16px',
              fontWeight: 500,
              fontFamily: 'Roboto',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            👑 Exclusive to Interview Mitra Partner Colleges
          </Typography>
        </Box>
      </Box>
    </MainCard>
  );
};

export default ShortAnswersAssessment;
