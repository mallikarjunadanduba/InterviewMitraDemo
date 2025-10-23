import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography, Alert, Card, CardContent, Chip } from '@mui/material';
import { fetchMcqCategories, fetchMcqByCategoryId } from 'views/API/McqCategoryApi';

// Import real icons
import { 
  Code, 
  DataObject, 
  Web, 
  Palette, 
  Language, 
  Storage, 
  Cloud, 
  Security, 
  Psychology, 
  Analytics, 
  PhoneAndroid, 
  Apple, 
  BugReport, 
  DesignServices,
  Computer,
  Settings,
  RocketLaunch,
  School,
  Quiz,
  Assignment,
  Science
} from '@mui/icons-material';

// MCQ icon mapping function using Material-UI icons
const getMcqIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('java')) return <Code style={{ fontSize: '2rem' }} />;
  if (name.includes('python')) return <Code style={{ fontSize: '2rem' }} />;
  if (name.includes('react')) return <Web style={{ fontSize: '2rem' }} />;
  if (name.includes('javascript') || name.includes('js')) return <Code style={{ fontSize: '2rem' }} />;
  if (name.includes('css')) return <Palette style={{ fontSize: '2rem' }} />;
  if (name.includes('html')) return <Language style={{ fontSize: '2rem' }} />;
  if (name.includes('node') || name.includes('express')) return <Settings style={{ fontSize: '2rem' }} />;
  if (name.includes('angular')) return <Web style={{ fontSize: '2rem' }} />;
  if (name.includes('vue')) return <Web style={{ fontSize: '2rem' }} />;
  if (name.includes('php')) return <Code style={{ fontSize: '2rem' }} />;
  if (name.includes('c++') || name.includes('cpp')) return <Code style={{ fontSize: '2rem' }} />;
  if (name.includes('c#')) return <Code style={{ fontSize: '2rem' }} />;
  if (name.includes('sql') || name.includes('database')) return <Storage style={{ fontSize: '2rem' }} />;
  if (name.includes('mongodb')) return <Storage style={{ fontSize: '2rem' }} />;
  if (name.includes('aws') || name.includes('cloud')) return <Cloud style={{ fontSize: '2rem' }} />;
  if (name.includes('docker')) return <Settings style={{ fontSize: '2rem' }} />;
  if (name.includes('git') || name.includes('github')) return <Code style={{ fontSize: '2rem' }} />;
  if (name.includes('android')) return <PhoneAndroid style={{ fontSize: '2rem' }} />;
  if (name.includes('ios') || name.includes('swift')) return <Apple style={{ fontSize: '2rem' }} />;
  if (name.includes('flutter')) return <PhoneAndroid style={{ fontSize: '2rem' }} />;
  if (name.includes('data') || name.includes('analytics')) return <Analytics style={{ fontSize: '2rem' }} />;
  if (name.includes('machine') || name.includes('ai') || name.includes('ml')) return <Psychology style={{ fontSize: '2rem' }} />;
  if (name.includes('blockchain') || name.includes('crypto')) return <DataObject style={{ fontSize: '2rem' }} />;
  if (name.includes('devops')) return <Settings style={{ fontSize: '2rem' }} />;
  if (name.includes('security') || name.includes('cyber')) return <Security style={{ fontSize: '2rem' }} />;
  if (name.includes('testing') || name.includes('qa')) return <BugReport style={{ fontSize: '2rem' }} />;
  if (name.includes('design') || name.includes('ui') || name.includes('ux')) return <DesignServices style={{ fontSize: '2rem' }} />;
  if (name.includes('mobile')) return <PhoneAndroid style={{ fontSize: '2rem' }} />;
  if (name.includes('web')) return <Web style={{ fontSize: '2rem' }} />;
  if (name.includes('backend')) return <Settings style={{ fontSize: '2rem' }} />;
  if (name.includes('frontend')) return <Computer style={{ fontSize: '2rem' }} />;
  if (name.includes('fullstack') || name.includes('full stack')) return <RocketLaunch style={{ fontSize: '2rem' }} />;
  if (name.includes('math') || name.includes('mathematics')) return <Science style={{ fontSize: '2rem' }} />;
  if (name.includes('aptitude') || name.includes('reasoning')) return <Assignment style={{ fontSize: '2rem' }} />;
  
  // Default fallback for MCQ
  return <Quiz style={{ fontSize: '2rem' }} />;
};

// Color scheme mapping function
const getMcqColors = (categoryName) => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('java')) return {
    primary: 'linear-gradient(135deg, #f89820 0%, #f5820d 100%)',
    hover: 'linear-gradient(135deg, #e8891e 0%, #e6730c 100%)'
  };
  if (name.includes('python')) return {
    primary: 'linear-gradient(135deg, #3776ab 0%, #2d5a87 100%)',
    hover: 'linear-gradient(135deg, #2d5a87 0%, #1e3a5f 100%)'
  };
  if (name.includes('react') || name.includes('javascript')) return {
    primary: 'linear-gradient(135deg, #61dafb 0%, #21d4fd 100%)',
    hover: 'linear-gradient(135deg, #21d4fd 0%, #00bcd4 100%)'
  };
  if (name.includes('css')) return {
    primary: 'linear-gradient(135deg, #1572b6 0%, #0d5a9a 100%)',
    hover: 'linear-gradient(135deg, #0d5a9a 0%, #06427e 100%)'
  };
  if (name.includes('html')) return {
    primary: 'linear-gradient(135deg, #e34f26 0%, #d73a1a 100%)',
    hover: 'linear-gradient(135deg, #d73a1a 0%, #c22e0e 100%)'
  };
  if (name.includes('node') || name.includes('express')) return {
    primary: 'linear-gradient(135deg, #68a063 0%, #4a7c59 100%)',
    hover: 'linear-gradient(135deg, #4a7c59 0%, #2c5f3f 100%)'
  };
  if (name.includes('angular')) return {
    primary: 'linear-gradient(135deg, #dd0031 0%, #c3002f 100%)',
    hover: 'linear-gradient(135deg, #c3002f 0%, #a9002d 100%)'
  };
  if (name.includes('vue')) return {
    primary: 'linear-gradient(135deg, #4fc08d 0%, #3ba374 100%)',
    hover: 'linear-gradient(135deg, #3ba374 0%, #2a865b 100%)'
  };
  if (name.includes('php')) return {
    primary: 'linear-gradient(135deg, #777bb4 0%, #5a5d8a 100%)',
    hover: 'linear-gradient(135deg, #5a5d8a 0%, #3d3f66 100%)'
  };
  if (name.includes('data') || name.includes('analytics')) return {
    primary: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
    hover: 'linear-gradient(135deg, #ee5a52 0%, #dd4939 100%)'
  };
  if (name.includes('machine') || name.includes('ai')) return {
    primary: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
    hover: 'linear-gradient(135deg, #7b1fa2 0%, #5e1a8a 100%)'
  };
  if (name.includes('aws') || name.includes('cloud')) return {
    primary: 'linear-gradient(135deg, #ff9900 0%, #e68900 100%)',
    hover: 'linear-gradient(135deg, #e68900 0%, #cc7a00 100%)'
  };
  if (name.includes('docker')) return {
    primary: 'linear-gradient(135deg, #2496ed 0%, #1e7bb8 100%)',
    hover: 'linear-gradient(135deg, #1e7bb8 0%, #1860a3 100%)'
  };
  if (name.includes('android')) return {
    primary: 'linear-gradient(135deg, #3ddc84 0%, #2bb673 100%)',
    hover: 'linear-gradient(135deg, #2bb673 0%, #199062 100%)'
  };
  if (name.includes('ios') || name.includes('swift')) return {
    primary: 'linear-gradient(135deg, #007aff 0%, #0056cc 100%)',
    hover: 'linear-gradient(135deg, #0056cc 0%, #003d99 100%)'
  };
  if (name.includes('flutter')) return {
    primary: 'linear-gradient(135deg, #02569b 0%, #013a6b 100%)',
    hover: 'linear-gradient(135deg, #013a6b 0%, #001e3b 100%)'
  };
  if (name.includes('blockchain')) return {
    primary: 'linear-gradient(135deg, #f7931a 0%, #e8841a 100%)',
    hover: 'linear-gradient(135deg, #e8841a 0%, #d9751a 100%)'
  };
  if (name.includes('devops')) return {
    primary: 'linear-gradient(135deg, #0073e6 0%, #005bb5 100%)',
    hover: 'linear-gradient(135deg, #005bb5 0%, #004384 100%)'
  };
  if (name.includes('security')) return {
    primary: 'linear-gradient(135deg, #ff4444 0%, #e63939 100%)',
    hover: 'linear-gradient(135deg, #e63939 0%, #cc2e2e 100%)'
  };
  if (name.includes('design') || name.includes('ui')) return {
    primary: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
    hover: 'linear-gradient(135deg, #c2185b 0%, #9c1443 100%)'
  };
  if (name.includes('mobile')) return {
    primary: 'linear-gradient(135deg, #673ab7 0%, #512da8 100%)',
    hover: 'linear-gradient(135deg, #512da8 0%, #3f1f99 100%)'
  };
  if (name.includes('fullstack') || name.includes('full stack')) return {
    primary: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
    hover: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)'
  };
  if (name.includes('math') || name.includes('mathematics')) return {
    primary: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
    hover: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)'
  };
  if (name.includes('aptitude') || name.includes('reasoning')) return {
    primary: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
    hover: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
  };
  
  // Default fallback colors for MCQ
  return {
    primary: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
    hover: 'linear-gradient(135deg, #7b1fa2 0%, #5e1a8a 100%)'
  };
};

const McqCategory = () => {
    const [showAll, setShowAll] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem('user'));
    const headers = {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + user.accessToken
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetchMcqCategories(headers);
                const fetchedData = res.data;
                if (fetchedData) {
                    const sortedData = fetchedData.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
                    setCategories(sortedData);
                }
            } catch (error) {
                console.error('Error fetching MCQ categories:', error);
                setError('Failed to fetch MCQ categories.');
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = async (categoryId, categoryName) => {
        try {
            const res = await fetchMcqByCategoryId(headers, categoryId);
            const fetchedData = res.data;
            if (fetchedData.length > 0) {
                navigate('/upSkills/mcqmodule', { state: { categoryId, categoryName, details: fetchedData } });
            } else {
                setError('No MCQs found for this category.');
            }
        } catch (error) {
            console.error('Error fetching MCQs:', error);
            setError('Failed to fetch MCQs.');
        }
    };

    return (
        <Box sx={{ position: 'relative' }}>
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ 
                        mb: 3, 
                        borderRadius: '8px',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                    }}
                >
                    {error}
                </Alert>
            )}
            
            <Grid container spacing={2}>
                {(showAll ? categories : categories.slice(0, 8)).map((category, index) => {
                    const mcqIcon = getMcqIcon(category.categoryName);
                    const colors = getMcqColors(category.categoryName);
                    
                    return (
                        <Grid item key={category.categoryId} xs={6} sm={4} md={3}>
                            <Card
                                onClick={() => handleCategoryClick(category.categoryId, category.categoryName)}
                                sx={{
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    borderRadius: "12px",
                                    background: colors.primary,
                                    color: "white",
                                    position: "relative",
                                    overflow: "hidden",
                                    minHeight: "120px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                                        background: colors.hover,
                                        "& .mcq-icon": {
                                            transform: "scale(1.1)",
                                        },
                                        "& .mcq-text": {
                                            transform: "translateY(-2px)",
                                        },
                                        "& .test-chip": {
                                            backgroundColor: "rgba(255,255,255,0.3)",
                                        },
                                        "& .quiz-badge": {
                                            transform: "scale(1.1)",
                                            opacity: 1,
                                        },
                                    },
                                }}
                            >
                                <CardContent
                                    sx={{
                                        position: "relative",
                                        zIndex: 2,
                                        textAlign: "center",
                                        padding: "16px !important",
                                        width: "100%",
                                    }}
                                >
                                    {/* Quiz Badge */}
                                    <Box
                                        className="quiz-badge"
                                        sx={{
                                            position: "absolute",
                                            top: "8px",
                                            right: "8px",
                                            background: "rgba(255,255,255,0.2)",
                                            borderRadius: "50%",
                                            width: "20px",
                                            height: "20px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.3s ease",
                                            opacity: 0.8,
                                            "& svg": {
                                                fontSize: "0.8rem",
                                                color: "white",
                                            },
                                        }}
                                    >
                                        <Quiz />
                                    </Box>

                                    <Box
                                        className="mcq-icon"
                                        sx={{
                                            marginBottom: "8px",
                                            transition: "all 0.3s ease",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "40px",
                                            "& svg": {
                                                fontSize: "2rem",
                                                color: "white",
                                            },
                                        }}
                                    >
                                        {mcqIcon}
                                    </Box>
                                    <Typography
                                        className="mcq-text"
                                        variant="h6"
                                        sx={{
                                            fontWeight: "600",
                                            fontSize: "1rem",
                                            lineHeight: 1.2,
                                            transition: "all 0.3s ease",
                                            marginBottom: "6px",
                                        }}
                                    >
                                        {category.categoryName}
                                    </Typography>
                                    <Chip
                                        className="test-chip"
                                        label="Start Test"
                                        size="small"
                                        sx={{
                                            backgroundColor: "rgba(255,255,255,0.2)",
                                            color: "white",
                                            fontSize: "0.7rem",
                                            fontWeight: "500",
                                            transition: "all 0.3s ease",
                                            textTransform: "uppercase",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
            
            {categories.length > 8 && !showAll && (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Box
                        component="button"
                        onClick={() => setShowAll(true)}
                        sx={{
                            background: "linear-gradient(135deg, #2a9d8f 0%, #03045e 100%)",
                            border: "none",
                            borderRadius: "8px",
                            paddingX: "24px",
                            paddingY: "12px",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow: "0 4px 12px rgba(42, 157, 143, 0.3)",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 20px rgba(42, 157, 143, 0.4)",
                                background: "linear-gradient(135deg, #03045e 0%, #2a9d8f 100%)",
                            },
                        }}
                    >
                        View All Tests
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default McqCategory;
