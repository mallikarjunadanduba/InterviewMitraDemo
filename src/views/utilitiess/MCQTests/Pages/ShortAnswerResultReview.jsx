import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Divider,
    Button,
    CircularProgress,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { 
  getShortAnswerExamHistoryById,
  getShortAnswerResultsByExamHistoryId 
} from 'views/API/SAQTestApi';

const ShortAnswerResultReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const historyId = location.state?.historyId || new URLSearchParams(location.search).get('historyId');

    const [examHistory, setExamHistory] = useState(null);
    const [examData, setExamData] = useState([]);
    const [loading, setLoading] = useState(true);

    const printRef = useRef();

    const user = JSON.parse(sessionStorage.getItem("user"));
    const headers = {
        "Content-type": "application/json",
        Authorization: "Bearer " + user.accessToken
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("ShortAnswerResultReview: Component mounted");
                console.log("ShortAnswerResultReview: Location state:", location.state);
                console.log("ShortAnswerResultReview: URL search params:", location.search);
                console.log("ShortAnswerResultReview: Final historyId:", historyId);
                
                if (!historyId) {
                    console.error("No historyId provided");
                    navigate('/jobs/short-answers-assessment');
                    return;
                }
                
                const historyRes = await getShortAnswerExamHistoryById(headers, historyId);
                console.log("Exam history fetched:", historyRes);
                
                const resultsRes = await getShortAnswerResultsByExamHistoryId(headers, historyId);
                console.log("Exam results fetched:", resultsRes);
                console.log("Results data structure:", resultsRes);
                console.log("Number of results:", resultsRes?.length);
                console.log("First result sample:", resultsRes?.[0]);
                
                setExamHistory(historyRes);
                // Handle both array and object responses
                const examResults = Array.isArray(resultsRes) ? resultsRes : (resultsRes?.data || []);
                console.log("Processed exam results:", examResults);
                setExamData(examResults);
            } catch (err) {
                console.error("Error fetching short answer exam data:", err);
                navigate('/jobs/short-answers-assessment');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [historyId, navigate]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: 'Short_Answer_Exam_Result_Report'
    });

    const getAnswerStatus = (isCorrect) => {
        return isCorrect ? 'Correct' : 'Incorrect';
    };

    const getColor = (status) => {
        if (status === 'Correct') return 'success';
        if (status === 'Incorrect') return 'error';
        return 'default';
    };

    const getScoreColor = (score) => {
        if (score >= 0.8) return 'success';
        if (score >= 0.6) return 'warning';
        return 'error';
    };

    if (loading) {
        return (
            <Box p={5} textAlign="center">
                <CircularProgress />
                <Typography mt={2}>Loading Short Answer Exam Result...</Typography>
            </Box>
        );
    }

    if (!examHistory) {
        return (
            <Box p={4}>
                <Typography variant="h6" color="error">Missing exam data. Redirecting...</Typography>
                <Button variant="contained" onClick={() => navigate("/jobs/short-answers-assessment")}>
                    Back to Short Answer Tests
                </Button>
            </Box>
        );
    }

    const {
        totalQuestions,
        attemptedQuestions,
        correctAnswers,
        wrongAnswers,
        unattempted,
        result,
        score,
        tabSwitchCount,
        tabSwitchPenalty,
        wrongAnswerPenalty
    } = examHistory;

    return (
        <Paper
            elevation={3}
            sx={{
                maxWidth: 1400,
                width: '100%',
                p: 3,
                borderRadius: 3,
                bgcolor: "#f5f7fa",
                minHeight: "100vh",
                m: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* Buttons for navigation and print */}
            <Box mb={2} alignSelf="flex-end" display="flex" gap={2} className="no-print">
                <Button variant="contained" onClick={() => navigate("/jobs/short-answers-assessment")}>
                    Back to Short Answer Tests
                </Button>
                <Button variant="outlined" onClick={handlePrint}>
                    Print Result
                </Button>
            </Box>

            {/* Printable section */}
            <div ref={printRef} style={{ width: "100%" }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    color="primary"
                    fontWeight={600}
                    textAlign="center"
                >
                    Short Answer Exam Result Report
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Summary Section */}
                <Card sx={{ mb: 4, p: 3, borderRadius: 3, boxShadow: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        📝 Overall Result Summary
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Chip
                                label={`Total Questions: ${totalQuestions}`}
                                variant="outlined"
                                sx={{ width: '100%', py: 1.5, fontSize: 16, fontWeight: 'bold' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Chip
                                color="info"
                                label={`Attempted: ${attemptedQuestions}`}
                                sx={{ width: '100%', py: 1.5, fontSize: 16, fontWeight: 'bold' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Chip
                                color="success"
                                label={`Correct: ${correctAnswers}`}
                                sx={{ width: '100%', py: 1.5, fontSize: 16, fontWeight: 'bold' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Chip
                                color="error"
                                label={`Wrong: ${wrongAnswers}`}
                                sx={{ width: '100%', py: 1.5, fontSize: 16, fontWeight: 'bold' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Chip
                                color="default"
                                label={`Unattempted: ${unattempted}`}
                                sx={{ width: '100%', py: 1.5, fontSize: 16, fontWeight: 'bold' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Chip
                                color={result?.trim().toLowerCase() === 'pass' ? 'success' : 'error'}
                                label={`Final Result: ${result}`}
                                sx={{ width: '100%', py: 1.5, fontSize: 16, fontWeight: 'bold' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Chip
                                color={getScoreColor(score)}
                                label={`Final Score: ${score?.toFixed(2) || '0.00'}`}
                                sx={{ width: '100%', py: 1.5, fontSize: 16, fontWeight: 'bold' }}
                            />
                        </Grid>

                        {tabSwitchCount > 0 && (
                            <Grid item xs={12} sm={6} md={4}>
                                <Chip
                                    color="warning"
                                    label={`Tab Switches: ${tabSwitchCount} (Penalty: ${tabSwitchPenalty})`}
                                    sx={{ width: '100%', py: 1.5, fontSize: 16, fontWeight: 'bold' }}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Card>

                <Divider sx={{ mb: 4 }} />

                {/* Debug Section - Remove in production */}
                {examData.length === 0 && (
                    <Card sx={{ mb: 3, p: 2, bgcolor: '#fff3cd', border: '1px solid #ffeaa7' }}>
                        <Typography variant="h6" color="warning.main">
                            ⚠️ Debug Information
                        </Typography>
                        <Typography variant="body2">
                            No exam results found. This could mean:
                        </Typography>
                        <ul>
                            <li>No questions were answered</li>
                            <li>API returned empty array</li>
                            <li>Data structure mismatch</li>
                        </ul>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Raw examData:</strong> {JSON.stringify(examData)}
                        </Typography>
                    </Card>
                )}

                {/* Question Review Section */}
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    📋 Detailed Question Analysis
                </Typography>

                {examData.length === 0 ? (
                    <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                        <Typography variant="h6" color="text.secondary">
                            No detailed results available
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            This exam may not have individual question results recorded.
                        </Typography>
                    </Card>
                ) : (
                <Grid container spacing={3}>
                    {examData.map((q, index) => {
                        const selected = q.studentAnswer || q.selectedAnswer || '';
                        const correct = q.correctAnswer;
                        const status = getAnswerStatus(q.correct || q.isCorrect);

                        return (
                            <Grid item xs={12} key={q.id || index}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderColor: '#ddd',
                                        borderRadius: 2,
                                        mb: 2
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            Q{index + 1}. {q.questionText}
                                        </Typography>

                                        <Box mt={1}>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Your Answer:</strong> {selected || 'Unanswered'}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Correct Answer:</strong> {correct}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Score:</strong> {q.scoreAwarded}{' '}
                                                {q.penaltyApplied < 0 && (
                                                    <Typography component="span" color="error">
                                                        (Penalty: {q.penaltyApplied})
                                                    </Typography>
                                                )}
                                            </Typography>
                                            <Typography variant="body2" mt={1}>
                                                <strong>Status: </strong>
                                                <Chip label={status} color={getColor(status)} size="small" />
                                            </Typography>
                                        </Box>

                                        {/* NLP Analysis Section */}
                                        {(q.keywordMatches || q.semanticSimilarity || q.confidenceScore || q.keywordMatchPercentage) && (
                                            <Accordion sx={{ mt: 2 }}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="nlp-analysis-content"
                                                    id="nlp-analysis-header"
                                                >
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        🤖 AI Analysis & NLP Evaluation
                                                    </Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Grid container spacing={2}>
                                                        {q.keywordMatches && q.keywordMatches !== "null" && (
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography variant="body2" gutterBottom>
                                                                    <strong>Keyword Matches:</strong>
                                                                </Typography>
                                                                <Box 
                                                                    sx={{ 
                                                                        p: 1, 
                                                                        bgcolor: '#e3f2fd', 
                                                                        borderRadius: 1,
                                                                        fontSize: '0.875rem'
                                                                    }}
                                                                >
                                                                    {q.keywordMatches}
                                                                </Box>
                                                            </Grid>
                                                        )}

                                                        {q.keywordMatchPercentage && (
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography variant="body2" gutterBottom>
                                                                    <strong>Keyword Match %:</strong>
                                                                </Typography>
                                                                <Chip 
                                                                    label={`${q.keywordMatchPercentage}%`}
                                                                    color={q.keywordMatchPercentage >= 70 ? 'success' : q.keywordMatchPercentage >= 50 ? 'warning' : 'error'}
                                                                    size="small"
                                                                />
                                                            </Grid>
                                                        )}

                                                        {q.semanticSimilarity && (
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography variant="body2" gutterBottom>
                                                                    <strong>Semantic Similarity:</strong>
                                                                </Typography>
                                                                <Chip 
                                                                    label={q.semanticSimilarity.toFixed(3)}
                                                                    color={q.semanticSimilarity >= 0.7 ? 'success' : q.semanticSimilarity >= 0.5 ? 'warning' : 'error'}
                                                                    size="small"
                                                                />
                                                            </Grid>
                                                        )}

                                                        {q.confidenceScore && (
                                                            <Grid item xs={12} sm={6}>
                                                                <Typography variant="body2" gutterBottom>
                                                                    <strong>Confidence Score:</strong>
                                                                </Typography>
                                                                <Chip 
                                                                    label={q.confidenceScore.toFixed(3)}
                                                                    color={q.confidenceScore >= 0.7 ? 'success' : q.confidenceScore >= 0.5 ? 'warning' : 'error'}
                                                                    size="small"
                                                                />
                                                            </Grid>
                                                        )}

                                                        {q.aiAnalysis && q.aiAnalysis !== null && (
                                                            <Grid item xs={12}>
                                                                <Typography variant="body2" gutterBottom>
                                                                    <strong>Detailed AI Analysis:</strong>
                                                                </Typography>
                                                                <Box 
                                                                    component="pre" 
                                                                    sx={{ 
                                                                        mt: 1, 
                                                                        p: 2, 
                                                                        bgcolor: '#f5f5f5', 
                                                                        borderRadius: 1,
                                                                        fontSize: '0.875rem',
                                                                        whiteSpace: 'pre-wrap',
                                                                        border: '1px solid #ddd'
                                                                    }}
                                                                >
                                                                    {q.aiAnalysis}
                                                                </Box>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
                )}
            </div>
        </Paper>
    );
};

export default ShortAnswerResultReview;
