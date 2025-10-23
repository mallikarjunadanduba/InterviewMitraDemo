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
    Paper
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { getExamHistoryById, getResultsByExamHistoryId } from 'views/API/MCATestApi';

const ResultReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const historyId = location.state?.historyId;

    const [examHistory, setExamHistory] = useState(null);
    const [mcqData, setMcqData] = useState([]);
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
                const historyRes = await getExamHistoryById(headers, historyId);
                const resultsRes = await getResultsByExamHistoryId(headers, historyId);
                setExamHistory(historyRes);
                setMcqData(resultsRes);
            } catch (err) {
                console.error(err);
                navigate('/jobs/tests');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [historyId, navigate]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: 'Exam_Result_Report'
    });

    const getAnswerStatus = (selected, correct) => {
        if (!selected) return 'Unanswered';
        return selected === correct ? 'Correct' : 'Wrong';
    };

    const getColor = (status) => {
        if (status === 'Correct') return 'success';
        if (status === 'Wrong') return 'error';
        return 'default';
    };

    if (loading) {
        return (
            <Box p={5} textAlign="center">
                <CircularProgress />
                <Typography mt={2}>Loading Exam Result...</Typography>
            </Box>
        );
    }

    if (!examHistory) {
        return (
            <Box p={4}>
                <Typography variant="h6" color="error">Missing exam data. Redirecting...</Typography>
                <Button variant="contained" onClick={() => navigate("/jobs/tests")}>Back to Tests</Button>
            </Box>
        );
    }

    const {
        totalQuestions,
        attemptedQuestions,
        correctAnswers,
        wrongAnswers,
        unattempted,
        result
    } = examHistory;

    return (
        <Paper
            elevation={3}
            sx={{
                maxWidth: 1300,
                width: '100%',
                p: 3,
                borderRadius: 3,
                bgcolor: "#f5f7fa",
                minHeight: "100vh",
                m: "auto",                // Centers it horizontally
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* Buttons for navigation and print */}
            <Box mb={2} alignSelf="flex-end" display="flex" gap={2} className="no-print">
                <Button variant="contained" onClick={() => navigate("/jobs/tests")}>
                    Back to Test List
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
                    Exam Result Report
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
                    </Grid>
                </Card>

                <Divider sx={{ mb: 4 }} />

                {/* Question Review Section */}
                <Grid container spacing={3}>
                    {mcqData.map((q, index) => {
                        const selected = q.selectedAnswer || '';
                        const correct = q.correctAnswer;
                        const status = getAnswerStatus(selected, correct);

                        return (
                            <Grid item xs={12} sm={6} md={4} key={q.id}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderColor: '#ddd',
                                        borderRadius: 2,
                                        height: '100%',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
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
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </div>
        </Paper>

    );
};

export default ResultReview;
