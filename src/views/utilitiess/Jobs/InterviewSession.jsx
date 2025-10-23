import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    Link as MuiLink,
    Stack,
    Button,
    Card,
    CardContent,
    Chip,
    Avatar,
    LinearProgress,
    Fade,
    Zoom,
    IconButton,
    Tooltip,
    Divider,
    Alert,
    CircularProgress
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import {
    Videocam as CameraIcon,
    Mic as MicIcon,
    Stop as StopIcon,
    PlayArrow as PlayIcon,
    Pause as PauseIcon,
    Download as DownloadIcon,
    Upload as UploadIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import VideoPreview from './InterviewComponents/VideoPreview';
import QuestionDisplay from './InterviewComponents/QuestionDisplay';
import RecorderControls from './InterviewComponents/RecorderControls';
import TranscriptResult from './InterviewComponents/TranscriptResult';
import { fetchInterviewSession, fetchDynamicQuestion } from '../../API/Interview/interviewApi';
import { uploadResume } from '../../API/Interview/resumeApi';
import InterviewMitraLogo from '../../../assets/images/logo/Interview_mitra_logo.png';

// Add CSS animations
const styles = `
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

const InterviewSession = () => {
    const { sessionId } = useParams();
    const [mediaStream, setMediaStream] = useState(null);
    const [questionData, setQuestionData] = useState({ category: '', text: '' });
    const [mode, setMode] = useState('predefined');
    const [questions, setQuestions] = useState({});
    const [response, setResponse] = useState(null);
    const [reportLink, setReportLink] = useState('');
    const [gifKey, setGifKey] = useState(Date.now());
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [interviewProgress, setInterviewProgress] = useState(0);
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [sessionStatus, setSessionStatus] = useState('preparing'); // preparing, active, completed


    const currentQIndex = useRef(0);
    const currentCIndex = useRef(0);

    useEffect(() => {
        const loadSession = async () => {
            try {
                setSessionStatus('preparing');
                const data = await fetchInterviewSession(sessionId);
                if (data.error) {
                    alert(data.error);
                    return;
                }
                setMode(data.question_mode || 'predefined');
                setQuestions(data.questions || {});

                // Calculate total questions
                const totalQ = Object.values(data.questions || {}).reduce((sum, arr) => sum + arr.length, 0);
                setTotalQuestions(totalQ);

                setSessionStatus('active');
            } catch (err) {
                console.error("Failed to load interview session", err);
                setSessionStatus('error');
            }
        };

        loadSession();
    }, [sessionId]);

    useEffect(() => {
        async function initCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setMediaStream(stream);
            } catch (err) {
                alert('Could not access webcam/mic: ' + err.message);
            }
        }
        initCamera();
    }, []);

    const refreshGif = () => {
        setGifKey(Date.now());
    };

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(
            (v) =>
                v.lang.startsWith("en") &&
                (v.name.toLowerCase().includes("female") ||
                    v.name.toLowerCase().includes("samantha") ||
                    v.name.toLowerCase().includes("zira") ||
                    v.name.toLowerCase().includes("google us"))
        );
        if (femaleVoice) utterance.voice = femaleVoice;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    const getPredefinedQuestion = () => {
        const categories = Object.keys(questions);
        const currentCategory = categories[currentCIndex.current];
        const list = questions[currentCategory];
        const text = list[currentQIndex.current];
        speak(text);
        setQuestionData({ category: currentCategory, text });
        refreshGif();
    };

    const getDynamicQuestion = async () => {
        try {
            const data = await fetchDynamicQuestion(sessionId);
            const question = data.question || 'Tell me about yourself.';
            speak(question);
            setQuestionData({ category: 'AI', text: question });
            refreshGif();
        } catch (error) {
            console.error("Error loading dynamic question", error);
            setQuestionData({ category: 'AI', text: '⚠️ Failed to load dynamic question.' });
        }
    };

    const loadNextQuestion = async () => {
        setResponse(null); // 👈 Reset to trigger "Processing..." message
        if (mode === 'predefined') {
            const categories = Object.keys(questions);
            const currentCategory = categories[currentCIndex.current];
            const list = questions[currentCategory];
            currentQIndex.current++;

            // Update progress
            const totalAnswered = (currentCIndex.current * (list?.length || 0)) + currentQIndex.current;
            setCurrentQuestionNumber(totalAnswered);
            setInterviewProgress((totalAnswered / totalQuestions) * 100);

            if (currentQIndex.current >= list.length) {
                currentCIndex.current++;
                currentQIndex.current = 0;
            }
            if (currentCIndex.current < categories.length) {
                getPredefinedQuestion();
            } else {
                setQuestionData({ category: '', text: '✅ Interview Completed!' });
                setReportLink(`/finalreport/${sessionId}`);
                setSessionStatus('completed');
                setInterviewProgress(100);
                stopStream();
            }
        } else {
            setCurrentQuestionNumber(prev => prev + 1);
            setInterviewProgress((currentQuestionNumber / 10) * 100); // Assume 10 questions for dynamic mode
            await getDynamicQuestion();
        }
    };

    const stopStream = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
        }
    };

    useEffect(() => {
        if (mode === 'predefined' && Object.keys(questions).length > 0) {
            getPredefinedQuestion();
        } else if (mode === 'dynamic') {
            getDynamicQuestion();
        }
    }, [questions, mode]);

    const handleResumeUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert("Please upload a PDF file.");
            return;
        }

        try {
            const result = await uploadResume(file);
            console.log("Resume uploaded successfully:", result);
            setResponse((prev) => ({
                ...prev,
                resume_summary: result.summary || 'Resume processed successfully!',
            }));
        } catch (error) {
            console.error("Resume upload failed:", error);
            alert("Resume upload failed. Please try again.");
        }
    };


    if (sessionStatus === 'preparing') {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 3
                }}
            >
                <CircularProgress size={60} sx={{ color: 'white' }} />
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                    Preparing Interview Session...
                </Typography>
            </Box>
        );
    }

    if (sessionStatus === 'error') {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 3
                }}
            >
                <WarningIcon sx={{ fontSize: 80, color: 'white' }} />
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                    Failed to Load Interview Session
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* Glassmorphism Header */}
            <Box
                sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    p: 2,
                    flexShrink: 0
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    maxWidth: '1400px',
                    mx: 'auto'
                }}>
                    {/* Left Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                        <Box
                            component="img"
                            src={InterviewMitraLogo}
                            alt="Interview Mitra"
                            sx={{
                                height: 24,
                                width: 'auto',
                                objectFit: 'contain'
                            }}
                        />


                    </Box>

                    {/* Center Progress */}
                    <Box sx={{ flex: 1, maxWidth: 400, mx: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                                Progress
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                                {currentQuestionNumber} / {totalQuestions || '∞'}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={interviewProgress}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 3,
                                    background: 'linear-gradient(90deg, #00D4AA 0%, #00AFB5 100%)'
                                }
                            }}
                        />
                    </Box>

                    {/* Right Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {isRecording && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    bgcolor: 'rgba(255, 71, 87, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'white',
                                        animation: 'pulse 2s infinite'
                                    }}
                                />
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}
                                >
                                    Recording
                                </Typography>
                            </Box>
                        )}
                        <Chip
                            label={mode === 'predefined' ? 'Predefined' : 'Dynamic'}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                fontSize: '0.75rem',
                                height: 28,
                                backdropFilter: 'blur(10px)'
                            }}
                            icon={<ScheduleIcon sx={{ fontSize: 16, color: 'white' }} />}
                        />
                    </Box>
                </Box>
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                    gap: 3,
                    p: 3,
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {/* Video Section */}
                <Fade in timeout={800}>
                    <Card
                        elevation={0}
                        sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: 4,
                            overflow: 'hidden',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            '& .MuiCard-root': {
                                borderRadius: 4
                            }
                        }}
                    >
                        {/* Video Container with Clean Design */}
                        <Box
                            sx={{
                                position: 'relative',
                                flex: 1,
                                minHeight: 0,
                                background: 'rgba(0, 0, 0, 0.2)',
                                overflow: 'hidden',
                                margin: 0,
                                padding: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 0
                            }}
                        >
                            {/* Video Frame with Clean Styling */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'transparent'
                                }}
                            >
                                <VideoPreview stream={mediaStream} />

                                {/* AI Bot Avatar - Bottom Right */}
                                <Zoom in timeout={1000}>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 12,
                                            right: 12,
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #00AFB5 0%, #00D4AA 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(0, 180, 216, 0.4)',
                                            border: '2px solid rgba(255, 255, 255, 0.2)',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={`https://miro.medium.com/v2/resize:fit:800/1*llqlfqGFKm9klLx_itWNLQ.gif?${gifKey}`}
                                            alt="AI Bot"
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '50%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </Box>
                                </Zoom>
                            </Box>
                        </Box>

                        {/* Controls Section */}
                        <Box
                            sx={{
                                p: 2,
                                flexShrink: 0,
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <RecorderControls
                                stream={mediaStream}
                                sessionId={sessionId}
                                questionData={questionData}
                                onNext={loadNextQuestion}
                                setResponse={setResponse}
                                setLoading={setLoading}
                            />
                        </Box>
                    </Card>
                </Fade>

                {/* Question & Response Section */}
                <Fade in timeout={1000}>
                    <Card
                        elevation={0}
                        sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: 3,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5, minHeight: 0 }}>
                            {/* Question Section */}
                            <Box sx={{ mb: 2, flexShrink: 0 }}>
                                <Box
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        backdropFilter: 'blur(15px)',
                                        p: 2.5,
                                        borderRadius: 2,
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 1.5, fontSize: '0.9rem' }}>
                                        Current Question
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                        {questionData.text || "Hey! I'm Chat-bot, are you ready for interview?"}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Response Section */}
                            <Box sx={{ flex: 1, mb: 2, minHeight: 0 }}>
                                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 1.5, fontSize: '1rem' }}>
                                    Your Response
                                </Typography>
                                <Box
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        backdropFilter: 'blur(15px)',
                                        p: 3,
                                        borderRadius: 2,
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'auto',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                                        minHeight: 160
                                    }}
                                >
                                    <TranscriptResult response={response} loading={loading} />
                                </Box>
                            </Box>

                            {/* Resume Upload */}
                            {questionData.text.toLowerCase().includes('upload your resume') && (
                                <Fade in timeout={500}>
                                    <Box sx={{ mb: 2.5, flexShrink: 0 }}>
                                        <Alert
                                            severity="info"
                                            icon={<UploadIcon />}
                                            sx={{
                                                mb: 1.5,
                                                borderRadius: 2,
                                                fontSize: '0.75rem',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                color: 'white'
                                            }}
                                        >
                                            Upload your resume to continue
                                        </Alert>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            startIcon={<UploadIcon />}
                                            size="small"
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                fontSize: '0.75rem',
                                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                                color: 'white',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(10px)',
                                                '&:hover': {
                                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                                }
                                            }}
                                        >
                                            Choose PDF File
                                            <input
                                                type="file"
                                                accept="application/pdf"
                                                onChange={handleResumeUpload}
                                                hidden
                                            />
                                        </Button>
                                    </Box>
                                </Fade>
                            )}

                            {/* Completion Section */}
                            {sessionStatus === 'completed' && (
                                <Fade in timeout={800}>
                                    <Box
                                        sx={{
                                            background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                                            backdropFilter: 'blur(10px)',
                                            p: 2.5,
                                            borderRadius: 3,
                                            textAlign: 'center',
                                            color: 'white',
                                            flexShrink: 0,
                                            boxShadow: '0 8px 24px rgba(0, 184, 148, 0.4)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)'
                                        }}
                                    >
                                        <CheckIcon sx={{ fontSize: 28, mb: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '0.9rem' }}>
                                            Interview Completed!
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, fontSize: '0.75rem' }}>
                                            Great job! Your responses have been recorded and analyzed.
                                        </Typography>
                                        <Button
                                            component={Link}
                                            to={reportLink}
                                            variant="contained"
                                            size="small"
                                            startIcon={<DownloadIcon />}
                                            sx={{
                                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                color: 'white',
                                                fontWeight: 700,
                                                px: 2.5,
                                                py: 1,
                                                borderRadius: 2,
                                                fontSize: '0.75rem',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 255, 255, 0.3)'
                                                }
                                            }}
                                        >
                                            Download Final Report
                                        </Button>
                                    </Box>
                                </Fade>
                            )}
                        </CardContent>
                    </Card>
                </Fade>
            </Box>
        </Box>
    );
};

export default InterviewSession;