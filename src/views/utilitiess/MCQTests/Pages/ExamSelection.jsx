import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
} from "@mui/material";
import { ArrowBack } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import academicImage from 'assets/images/InterviewPrepare/academic.png';
import upskillsImage from 'assets/images/InterviewPrepare/upskills.png';

const ExamSelection = () => {
  const navigate = useNavigate();

  const handleAcademicExam = () => {
    navigate('/jobs/academic-test');
  };

  const handleUpSkillsExam = () => {
    navigate('/jobs/test-instructions');
  };

  const handleBack = () => {
    navigate(-1);
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
          Choose Your Test Assessment Type
        </Typography>

        {/* Subtitle and Back Button Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
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
            Advanced online Test Assessments powered by AI technology for accurate and personalized evaluation
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
          {/* Academic Exam Card */}
          <Card
            elevation={0}
            sx={{
              width: { xs: '100%', sm: '45%', md: 400 },
              maxWidth: 400,
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
                background: 'rgba(37, 99, 235, 0.1)',
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
                src={academicImage}
                alt="Academic"
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
                  color: '#2563EB',
                  mb: 1
                }}
              >
                Academic Test Assessment
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
                AI-Enhanced Knowledge Testing
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
                Comprehensive academic assessment with AI working behind the scenes to provide adaptive questions and intelligent evaluation of your knowledge
              </Typography>

              {/* Button */}
              <Button
                variant="contained"
                size="large"
                onClick={handleAcademicExam}
                sx={{
                  width: '100%',
                  height: 48,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: 'Roboto',
                  backgroundColor: '#2563EB',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#2563EB',
                    opacity: 0.9,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                Start Academic Test
              </Button>
            </Box>
          </Card>

          {/* Up Skills Test Card */}
          <Card
            elevation={0}
            sx={{
              width: { xs: '100%', sm: '45%', md: 400 },
              maxWidth: 400,
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
                background: 'rgba(109, 40, 217, 0.1)',
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
                src={upskillsImage}
                alt="Up Skills"
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
                  color: '#6D28D9',
                  mb: 1
                }}
              >
              Up Skills Test Assessment
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
                AI-Powered Skill Testing
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
                Advanced skills assessment leveraging AI technology to evaluate practical competencies with intelligent analysis and personalized feedback
              </Typography>

              {/* Button */}
              <Button
                variant="contained"
                size="large"
                onClick={handleUpSkillsExam}
                sx={{
                  width: '100%',
                  height: 48,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: 'Roboto',
                  backgroundColor: '#6D28D9',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#6D28D9',
                    opacity: 0.9,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                Start Skills Test
              </Button>
            </Box>
          </Card>
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
            ⚡ Powered by Advanced AI Assessment Engine
          </Typography>
        </Box>
      </Box>
    </MainCard>
  );
};

export default ExamSelection;
