import React, { useEffect, useRef, useState } from "react";
import { Container, Grid, Button, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles"; 
import { useNavigate } from "react-router-dom"; 
import { motion } from "framer-motion";
import ScrollAnimation from "../../../ui-component/extended/ScrollAnimation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// Using hero image for interview preparation
import bannerImage from "../../../assets/images/homebanner/hero (2).png";

const StyledBanner = styled("div")(({ theme }) => ({
  backgroundColor: "white",  
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  width: "100%",
  position: "relative",
  overflow: "hidden",
  marginTop: "-50px",
  
  [theme.breakpoints.down("md")]: {
    minHeight: "auto",
    height: "auto",
    marginTop: "-30px",
  },
}));


function HomeBanner() {
  const navigate = useNavigate(); 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [isVisible, setIsVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const contentRef = useRef(null);
  const visualRef = useRef(null);
  
  const fullText = "We'll get back to you? ";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    if (visualRef.current) {
      observer.observe(visualRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (isVisible) {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          // Reset after a pause
          setTimeout(() => {
            currentIndex = 0;
            setDisplayedText('');
          }, 2000);
        }
      }, 100);

      return () => clearInterval(typingInterval);
    }
  }, [isVisible, fullText]);

  const handlePracticeClick = () => {
    navigate("/jobs"); 
  };

  const handleInsightsClick = () => {
    navigate("/upSkills"); 
  };

  return (
    <StyledBanner id="home">
      <Box sx={{ 
        width: '100%', 
        maxWidth: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          height: '100%',
          alignItems: 'center',
          gap: { xs: 2, md: 0 },
          py: { xs: 4, md: 0 }
        }}>
          {/* Left Content - HeroContent */}
          <Box 
            ref={contentRef}
            sx={{ 
              flex: { xs: 1, md: 0.6 }, 
              position: 'relative',
              paddingLeft: { xs: 2, sm: 4, md: '102px' },
              paddingRight: { xs: 2, sm: 4, md: '50px' },
              paddingTop: { xs: 4, sm: 0, md: 0 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Tired of hearing */}
            <Typography
              sx={{
                width: { xs: '100%', sm: '190px' },
                height: { xs: 'auto', sm: '36px' },
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 500,
                fontSize: { xs: '18px', sm: '20px', md: '24px' },
                lineHeight: 1,
                letterSpacing: '0px',
                color: '#000000',
                margin: 0,
                marginBottom: { xs: '12px', sm: '16px' },
                fontStyle: 'normal',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s'
              }}
            >
              Tired of hearing
            </Typography>
            
            {/* We'll get back to you? | */}
            <Typography
              sx={{
                width: { xs: '100%', sm: '100%', md: '654px' },
                height: { xs: 'auto', sm: 'auto', md: '84px' },
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 600,
                fontSize: { xs: '28px', sm: '40px', md: '56px' },
                lineHeight: { xs: 1.1, sm: 1.05, md: 1 },
                letterSpacing: '0px',
                color: '#2A9D8F',
                margin: 0,
                marginBottom: { xs: '8px', sm: '6px' },
                fontStyle: 'normal',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
                minHeight: { xs: '60px', sm: '80px', md: '84px' },
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {displayedText}
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: '2px',
                  height: { xs: '28px', sm: '40px', md: '56px' },
                  backgroundColor: '#2A9D8F',
                  marginLeft: '2px',
                  animation: 'blink 1s infinite',
                  '@keyframes blink': {
                    '0%, 50%': { opacity: 1 },
                    '51%, 100%': { opacity: 0 }
                  }
                }}
              />
            </Typography>
            
            {/* Description text */}
            <Typography
              sx={{
                width: { xs: '100%', sm: '100%', md: '635px' },
                height: { xs: 'auto', sm: 'auto', md: '99px' },
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 500,
                fontSize: { xs: '16px', sm: '18px', md: '22px' },
                lineHeight: { xs: 1.5, sm: 1.4, md: 1.4 },
                letterSpacing: '0px',
                color: '#666666',
                margin: 0,
                marginBottom: { xs: '20px', sm: '16px' },
                fontStyle: 'normal',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
                '& .highlight': {
                  fontWeight: 600,
                  fontFamily: '"Poppins", sans-serif'
                }
              }}
            >
              <span className="highlight">Let's fix that !!</span> Practice real interview questions, get AI-powered feedback, and step into your next interview with confidence.
            </Typography>
            
            {/* Buttons container */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: '9px' },
              width: { xs: '100%', sm: 'auto' },
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s'
            }}>
              {/* Start Your First Practice button */}
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  width: { xs: '280px', sm: '280px' },
                  height: { xs: '48px', sm: '42px' },
                  backgroundColor: '#F4A261',
                  color: 'white',
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 500,
                  fontSize: { xs: '16px', sm: '14px' },
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: '#E76F51',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(244, 162, 97, 0.3)'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  }
                }}
                onClick={handlePracticeClick}
              >
                Start Your First Practice
              </Button>
              
              {/* Explore Insights button */}
              <Button
                variant="outlined"
                sx={{
                  width: { xs: '180px', sm: '180px' },
                  height: { xs: '48px', sm: '42px' },
                  borderColor: '#000000',
                  color: '#000000',
                  fontFamily: '"Poppins", sans-serif',
                  fontWeight: 400,
                  fontSize: { xs: '16px', sm: '14px' },
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  borderRadius: '8px',
                  textTransform: 'none',
                  backgroundColor: 'transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    borderColor: '#333333'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  }
                }}
                onClick={handleInsightsClick}
              >
                Explore Insights
              </Button>
            </Box>
          </Box>

          {/* Right Content - HeroVisual */}
          <Box 
            ref={visualRef}
            sx={{ 
              flex: { xs: 1, md: 0.4 }, 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: { xs: '400px', sm: '500px', md: '100%' },
              padding: { xs: 2, sm: 4, md: '50px' },
              paddingTop: { xs: 4, sm: 4, md: '50px' },
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Simple image display */}
            <Box
              component="img"
              src={bannerImage}
              alt="Interview Practice"
              sx={{
                width: { xs: '360px', sm: '350px', md: '400px', lg: '450px' },
                height: { xs: '410px', sm: '400px', md: '450px', lg: '500px' },
                objectFit: 'contain',
                objectPosition: 'center',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    </StyledBanner>
  );
}

export default HomeBanner;