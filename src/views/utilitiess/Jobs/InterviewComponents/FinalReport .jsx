import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    CircularProgress,
    Container,
    Paper,
    Fade
} from '@mui/material';

// Lazy imports
const ReportHeader = lazy(() => import('./ReportHeader'));
const ReportSummary = lazy(() => import('./ReportSummary'));
const ReportDetails = lazy(() => import('./ReportDetails'));
const BackToHomeLink = lazy(() => import('./BackToHomeLink'));

const FinalReport = () => {
    const { sessionId } = useParams();
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        async function fetchReport() {
            // Mock response
            const mockResponse = {
                overall_score: 84.5,
                report: {
                    Behavioral: {
                        'Describe a time you had a conflict at work and how you resolved it.': {
                            transcript: 'I resolved it by discussing calmly and offering a compromise.',
                            sentiment: 'Positive',
                            score: 0.87,
                        },
                    },
                    Technical: {
                        'What is a closure in JavaScript?': {
                            transcript: 'A closure is a function with preserved data scope.',
                            sentiment: 'Neutral',
                            score: 0.82,
                        },
                    },
                },
            };

            setReportData(mockResponse);
            setLoading(false);
        }

        fetchReport();
    }, [sessionId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={8}>
                <CircularProgress size={50} />
            </Box>
        );
    }

    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                mt: 12,
                mb: 8,
                px: { xs: 1, sm: 2, md: 3 }, // Optional padding for larger screens
            }}
        >
            <Fade in>
                <Paper
                    id="printable-report"
                    elevation={4}
                    sx={{
                        p: { xs: 3, sm: 3 },
                        borderRadius: 4,
                        bgcolor: '#f9f9f9',
                        width: {
                            xs: '85%',      // Full width on mobile
                            sm: '90%',       // Slightly smaller on tablets
                            md: '95%',      // Full width on desktop
                        },
                        mx: 'auto',        // Center horizontally
                    }}
                >
                    <Suspense fallback={<CircularProgress />}>
                        <Box sx={{ borderBottom: '2px solid #00AFB5', pb: 2, mb: 4 }}>
                            <ReportHeader sessionId={sessionId} />
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <ReportSummary score={reportData.overall_score} />
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <ReportDetails report={reportData.report} />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <BackToHomeLink />
                            <Box
                                component="button"
                                onClick={() => window.print()}
                                sx={{
                                    border: 'none',
                                    backgroundColor: '#00AFB5',
                                    color: '#fff',
                                    px: 3,
                                    py: 1,
                                    borderRadius: 2,
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#0096a0',
                                    },
                                }}
                            >
                                🖨️ Print Report
                            </Box>
                        </Box>
                    </Suspense>
                </Paper>
            </Fade>
        </Container>
    );
};

export default FinalReport;
