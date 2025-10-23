import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, Button, Paper, Divider, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent,
} from "@mui/material";
import { ArrowBack } from '@mui/icons-material';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Swal from "sweetalert2";
import { fetchMcqTopic, getMcqDataByRequest, getAllExpertiseLevels } from "views/API/MCATestApi";
import MainCard from 'ui-component/cards/MainCard';
import questionIcon from 'assets/images/InterviewPrepare/formicons/Question.png';
import durationIcon from 'assets/images/InterviewPrepare/formicons/Durations.png';
import sectionsIcon from 'assets/images/InterviewPrepare/formicons/Sections.png';
import modeIcon from 'assets/images/InterviewPrepare/formicons/Mode.png';
import basicsIcon from 'assets/images/InterviewPrepare/formicons/Basics.png';
import timeIcon from 'assets/images/InterviewPrepare/formicons/time.png';
import criticallyIcon from 'assets/images/InterviewPrepare/formicons/critically.png';
import improveIcon from 'assets/images/InterviewPrepare/formicons/improve.png';
import mitraIcon from 'assets/images/InterviewPrepare/formicons/Mitra.png';
import starIcon from 'assets/images/InterviewPrepare/formicons/star.png';

const PracticeInstructions = () => {
    const navigate = useNavigate();
    const [isSingleTab, setIsSingleTab] = useState(true);
    const [topicList, setTopicList] = useState([]);
    const [expertiseLevels, setExpertiseLevels] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedExpertiseLevel, setSelectedExpertiseLevel] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const tabIdRef = useRef(Date.now());
    const channelRef = useRef(null);

    const testName = "Multiple Choice Questions Practice Session";
    const totalQuestions = 20;
    const selectedMode = "PRACTICE";
    const durationMinutes = 20; 



    const user = JSON.parse(sessionStorage.getItem("user"));
    const headers = {
        "Content-type": "application/json",
        Authorization: "Bearer " + user.accessToken
    };

    useEffect(() => {
        const channel = new BroadcastChannel('exam_channel');
        channelRef.current = channel;

        channel.postMessage({ type: "check", tabId: tabIdRef.current });

        channel.onmessage = (event) => {
            const { type, tabId } = event.data;
            if (type === "check") {
                channel.postMessage({ type: "active", tabId: tabIdRef.current });
            } else if (type === "active" && tabId !== tabIdRef.current) {
                setIsSingleTab(false);
            }
        };

        return () => {
            channel.close();
        };
    }, []);

    useEffect(() => {
        fetchMcqTopic(headers)
            .then(data => {
                setTopicList(data?.content || []);
            })
            .catch(err => {
                console.error("Error fetching topics:", err);
            });
    }, []);

    useEffect(() => {
        getAllExpertiseLevels(headers)
            .then(data => {
               
                setExpertiseLevels(data || []);
            })
            .catch(err => {
                console.error("Error fetching expertise levels:", err);
            });
    }, []);


    const handleStart = async () => {
        if (!isSingleTab) {
            alert("Another tab is open. Close it before starting.");
            return;
        }

        if (!selectedTopic) {
            Swal.fire("Incomplete", "Please select a topic", "warning");
            return;
        }

        if (!selectedExpertiseLevel) {
            Swal.fire("Incomplete", "Please select expertise level", "warning");
            return;
        }


        const selectedTopicObj = topicList.find(topic => topic.topicId === selectedTopic);
        if (!selectedTopicObj) {
            Swal.fire("Error", "Invalid topic selected", "error");
            return;
        }

        setIsLoading(true);

        const requestBody = {
            expertiseLevelId: parseInt(selectedExpertiseLevel),
            mode: "Practice",
            numberOfQuestions: totalQuestions,
            shortAnswerTopicDTOList: [
                {
                    topicId: selectedTopicObj.topicId
                }
            ]
        };

        console.log("Request body:", requestBody);
        console.log("Headers:", headers);

        try {
            const data = await getMcqDataByRequest(requestBody, headers);
            if (data && data.length > 0) {
                navigate("/jobs/exam", {
                    state: {
                        mcqData: data,
                        selectedTopic: selectedTopicObj,
                        selectedMode,
                        expertiseLevelId: selectedExpertiseLevel
                    }
                });
            } else {
                Swal.fire("No Questions", "No MCQs available for selected filters.", "info");
            }
        } catch (err) {
            console.error("MCQ fetch error:", err);
            Swal.fire("Error", "Something went wrong while fetching questions.", "error");
        } finally {
            setIsLoading(false);
        }
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
                    {testName}
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
                        Enhance your skills with targeted practice and comprehensive assessments
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
                        mb: 4
                    }}
                />

                {/* Meta Info Cards */}
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Card 
                        elevation={0}
                        sx={{ 
                            width: 140,
                            height: 133,
                            borderRadius: '12px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            boxShadow: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2
                        }}
                    >
                        <Box
                            component="img"
                            src={questionIcon}
                            alt="Questions"
                            sx={{
                                width: 49,
                                height: 47,
                                mb: 1,
                                opacity: 1
                            }}
                        />
                        <Typography 
                            sx={{ 
                                fontFamily: 'Roboto',
                                fontWeight: 700,
                                fontSize: '20px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#1F2937',
                                mb: 0.5,
                                textAlign: 'center'
                            }}
                        >
                            {totalQuestions}
                        </Typography>
                        <Typography 
                            sx={{ 
                                fontFamily: 'Roboto',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#6B7280',
                                textAlign: 'center'
                            }}
                        >
                            Questions
                        </Typography>
                    </Card>
                    
                    <Card 
                        elevation={0}
                        sx={{ 
                            width: 140,
                            height: 133,
                            borderRadius: '12px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            boxShadow: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2
                        }}
                    >
                        <Box
                            component="img"
                            src={durationIcon}
                            alt="Duration"
                            sx={{
                                width: 49,
                                height: 47,
                                mb: 1,
                                opacity: 1
                            }}
                        />
                        <Typography 
                            sx={{ 
                                fontFamily: 'Roboto',
                                fontWeight: 700,
                                fontSize: '20px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#1F2937',
                                mb: 0.5,
                                textAlign: 'center'
                            }}
                        >
                            {durationMinutes} min
                        </Typography>
                        <Typography 
                            sx={{ 
                                fontFamily: 'Roboto',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#6B7280',
                                textAlign: 'center'
                            }}
                        >
                            Duration
                        </Typography>
                    </Card>
                    
                    <Card 
                        elevation={0}
                        sx={{ 
                            width: 140,
                            height: 133,
                            borderRadius: '12px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            boxShadow: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2
                        }}
                    >
                        <Box
                            component="img"
                            src={sectionsIcon}
                            alt="Sections"
                            sx={{
                                width: 49,
                                height: 47,
                                mb: 1,
                                opacity: 1
                            }}
                        />
                        <Typography 
                            sx={{ 
                                fontFamily: 'Roboto',
                                fontWeight: 700,
                                fontSize: '20px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#1F2937',
                                mb: 0.5,
                                textAlign: 'center'
                            }}
                        >
                            1
                        </Typography>
                        <Typography 
                            sx={{ 
                                fontFamily: 'Roboto',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#6B7280',
                                textAlign: 'center'
                            }}
                        >
                            Sections
                        </Typography>
                    </Card>
                    
                    <Card 
                        elevation={0}
                        sx={{ 
                            width: 140,
                            height: 133,
                            borderRadius: '12px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            boxShadow: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2
                        }}
                    >
                        <Box
                            component="img"
                            src={modeIcon}
                            alt="Mode"
                            sx={{
                                width: 49,
                                height: 47,
                                mb: 1,
                                opacity: 1
                            }}
                        />
                        <Typography 
                            sx={{ 
                                fontFamily: 'Roboto',
                                fontWeight: 700,
                                fontSize: '20px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#1F2937',
                                mb: 0.5,
                                textAlign: 'center'
                            }}
                        >
                            Practice
                        </Typography>
                        <Typography 
                            sx={{ 
                                fontFamily: 'Roboto',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '124%',
                                letterSpacing: '1%',
                                color: '#6B7280',
                                textAlign: 'center'
                            }}
                        >
                            Mode
                        </Typography>
                    </Card>
                </Box>

                {/* Instructions - Two Panel Layout */}
                <Box sx={{ 
                    display: 'flex', 
                    gap: { xs: 2, sm: 2, md: 3 }, 
                    mb: 4, 
                    flexWrap: 'wrap',
                    flexDirection: { xs: 'column', sm: 'column', md: 'row' }
                }}>
                    {/* Left Panel - Up Skills Instructions */}
                    <Card 
                        elevation={0}
                        sx={{ 
                            flex: { xs: 'none', sm: 'none', md: 1 },
                            width: { xs: '100%', sm: '100%', md: 'auto' },
                            minWidth: { xs: 'auto', sm: 'auto', md: 300 },
                            borderRadius: '16px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            p: { xs: 2, sm: 2, md: 3 }
                        }}
                    >
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontFamily: 'Roboto',
                                fontWeight: 600,
                                fontSize: '18px',
                                color: '#1F2937',
                                mb: 3
                            }}
                        >
                         Multiple Choice Questions Practice Instructions
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            {/* Start with the Basics */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box
                                    component="img"
                                    src={basicsIcon}
                                    alt="Basics"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        flexShrink: 0,
                                        mt: 0.5
                                    }}
                                />
                                <Box>
                                    <Typography 
                                        sx={{ 
                                            fontFamily: 'Roboto',
                                            fontWeight: 600,
                                            fontSize: '16px',
                                            color: '#111827',
                                            mb: 0.5
                                        }}
                                    >
                                        Timed Practice
                                    </Typography>
                                    <Typography 
                                        sx={{ 
                                            fontFamily: 'Roboto',
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            color: '#6B7280',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        Auto-submits when time ends to simulate real exam conditions
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Manage your time */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box
                                    component="img"
                                    src={timeIcon}
                                    alt="Time"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        flexShrink: 0,
                                        mt: 0.5
                                    }}
                                />
                                <Box>
                                    <Typography 
                                        sx={{ 
                                            fontFamily: 'Roboto',
                                            fontWeight: 600,
                                            fontSize: '16px',
                                            color: '#111827',
                                            mb: 0.5
                                        }}
                                    >
                                        Practice Mode
                                    </Typography>
                                    <Typography 
                                        sx={{ 
                                            fontFamily: 'Roboto',
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            color: '#6B7280',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        Results visible after submit with unlimited attempts allowed
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Think critically */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box
                                    component="img"
                                    src={criticallyIcon}
                                    alt="Critically"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        flexShrink: 0,
                                        mt: 0.5
                                    }}
                                />
                                <Box>
                                    <Typography 
                                        sx={{ 
                                            fontFamily: 'Roboto',
                                            fontWeight: 600,
                                            fontSize: '16px',
                                            color: '#111827',
                                            mb: 0.5
                                        }}
                                    >
                                        Review Answers
                                    </Typography>
                                    <Typography 
                                        sx={{ 
                                            fontFamily: 'Roboto',
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            color: '#6B7280',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        Review answers with correct solutions after submission
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Review and improve */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box
                                    component="img"
                                    src={improveIcon}
                                    alt="Improve"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        flexShrink: 0,
                                        mt: 0.5
                                    }}
                                />
                                <Box>
                                    <Typography 
                                        sx={{ 
                                            fontFamily: 'Roboto',
                                            fontWeight: 600,
                                            fontSize: '16px',
                                            color: '#111827',
                                            mb: 0.5
                                        }}
                                    >
                                        Skill Development
                                    </Typography>
                                    <Typography 
                                        sx={{ 
                                            fontFamily: 'Roboto',
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            color: '#6B7280',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        Focus on areas that need improvement for continuous skill enhancement
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Card>

                    {/* Right Panel - Mitra Recommends */}
                    <Card 
                        elevation={0}
                        sx={{ 
                            flex: { xs: 'none', sm: 'none', md: 0.6 },
                            width: { xs: '100%', sm: '100%', md: 'auto' },
                            minWidth: { xs: 'auto', sm: 'auto', md: 250 },
                            maxWidth: { xs: 'none', sm: 'none', md: 350 },
                            borderRadius: '16px',
                            backgroundColor: '#E8EFFF',
                            border: '1px solid #00B4D84D',
                            p: { xs: 2, sm: 2, md: 3 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}
                    >
                        {/* Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: 'center' }}>
                            <Box
                                component="img"
                                src={mitraIcon}
                                alt="Mitra"
                                sx={{
                                    width: 40,
                                    height: 40
                                }}
                            />
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    fontFamily: 'Roboto',
                                    fontWeight: 600,
                                    fontSize: '18px',
                                    color: '#1E3A8A'
                                }}
                            >
                                Mitra Recommends
                            </Typography>
                        </Box>

                        {/* Recommendation Cards */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', width: '100%' }}>
                            {/* Skill Assessment Card */}
                            <Card 
                                elevation={0}
                                sx={{ 
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '12px',
                                    border: '1px solid #00B4D84D',
                                    p: 2.5,
                                    textAlign: 'left',
                                    width: '100%'
                                }}
                            >
                                <Typography 
                                    sx={{ 
                                        fontFamily: 'Roboto',
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        color: '#1F2937',
                                        mb: 1
                                    }}
                                >
                                    Skill Assessment
                                </Typography>
                                <Typography 
                                    sx={{ 
                                        fontFamily: 'Roboto',
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        color: '#6B7280',
                                        mb: 1.5,
                                        lineHeight: '1.5'
                                    }}
                                >
                                    Focus on core competencies and industry-relevant skills
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box
                                        component="img"
                                        src={starIcon}
                                        alt="Star"
                                        sx={{
                                            width: 16,
                                            height: 16
                                        }}
                                    />
                                    <Typography 
                                        sx={{ 
                                            fontFamily: 'Roboto',
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            color: '#2563EB'
                                        }}
                                    >
                                        87% Match Rate
                                    </Typography>
                                </Box>
                            </Card>

                            {/* Practice Schedule Card */}
                            <Card 
                                elevation={0}
                                sx={{ 
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '12px',
                                    border: '1px solid #00B4D84D',
                                    p: 2.5,
                                    textAlign: 'left',
                                    width: '100%'
                                }}
                            >
                                <Typography 
                                    sx={{ 
                                        fontFamily: 'Roboto',
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        color: '#1F2937',
                                        mb: 1
                                    }}
                                >
                                    Practice Schedule
                                </Typography>
                                <Typography 
                                    sx={{ 
                                        fontFamily: 'Roboto',
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        color: '#6B7280',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    Optimal time: 2-3 sessions per week, 20 minutes each
                                </Typography>
                            </Card>
                        </Box>
                    </Card>
                </Box>

                {/* Customize Your Practice Form */}
                <Card 
                    elevation={0}
                    sx={{ 
                        mb: 4,
                        width: { xs: '100%', sm: '100%', md: '100%' },
                        maxWidth: { xs: '100%', sm: '100%', md: 'none' },
                        minHeight: 146,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        border: '1px solid #B7B7B7',
                        p: 3,
                        boxShadow: 'none',
                        mx: 'auto'
                    }}
                >
                    {/* Title */}
                    <Typography 
                        sx={{ 
                            fontFamily: 'Roboto',
                            fontWeight: 600,
                            fontSize: '18px',
                            color: '#111827',
                            mb: 3
                        }}
                    >
                        Customize Your Practice
                    </Typography>

                    {/* Form Fields */}
                    <Box sx={{ 
                        display: "flex", 
                        gap: { xs: 2, sm: 2, md: 3 }, 
                        flexWrap: { xs: "wrap", sm: "wrap", md: "nowrap" }, 
                        mb: 3,
                        justifyContent: { xs: "center", sm: "center", md: "space-between" },
                        alignItems: "flex-start",
                        width: "100%"
                    }}>
                        {/* Topic selector */}
                        <FormControl sx={{ 
                            flex: { xs: '1 1 100%', sm: '1 1 45%', md: 1 }, 
                            minWidth: { xs: 200, sm: 180, md: 0 },
                            maxWidth: { xs: '100%', sm: '45%', md: 'none' }
                        }}>
                            <InputLabel>Topic</InputLabel>
                            <Select
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                                label="Topic"
                            >
                                {topicList.map((topic) => (
                                    <MenuItem key={topic.topicId} value={topic.topicId}>
                                        {topic.topicName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Expertise Level selector */}
                        <FormControl sx={{ 
                            flex: { xs: '1 1 100%', sm: '1 1 45%', md: 1 }, 
                            minWidth: { xs: 200, sm: 180, md: 0 },
                            maxWidth: { xs: '100%', sm: '45%', md: 'none' }
                        }}>
                            <InputLabel>Expertise Level</InputLabel>
                            <Select
                                value={selectedExpertiseLevel}
                                onChange={(e) => setSelectedExpertiseLevel(e.target.value)}
                                label="Expertise Level"
                                disabled={expertiseLevels.length === 0}
                            >
                                {expertiseLevels.length === 0 ? (
                                    <MenuItem disabled>Loading expertise levels...</MenuItem>
                                ) : (
                                    expertiseLevels.map((level) => (
                                        <MenuItem key={level.expertiseLevelId} value={level.expertiseLevelId}>
                                            {level.levelName}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>

                    </Box>
                </Card>

                {/* Buttons */}
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            endIcon={<PlayArrowIcon />}
                            onClick={handleStart}
                            disabled={isLoading}
                            sx={{ 
                                width: 248,
                                height: 50,
                                fontSize: "16px", 
                                fontWeight: 500,
                                backgroundColor: '#2563EB',
                                borderRadius: '8px',
                                boxShadow: '0px 4px 6px -4px #2563EB80, 0px 10px 15px -3px #2563EB80',
                                '&:hover': {
                                    backgroundColor: '#1D4ED8',
                                    boxShadow: '0px 4px 6px -4px #2563EB80, 0px 10px 15px -3px #2563EB80'
                                }
                            }}
                        >
                            {isLoading ? "Loading..." : "Start Your Practice"}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

export default PracticeInstructions;
