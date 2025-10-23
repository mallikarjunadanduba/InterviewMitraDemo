import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Grid,
    Card,
    CardContent,
    Divider,
    Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getExamHistoriesBySeekerId } from "views/API/MCATestApi";

const ExamHistory = () => {
    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem("user"));
    const seekerId = user?.seekerId;
    const headers = {
        "Content-type": "application/json",
        Authorization: "Bearer " + user?.accessToken,
    };

    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!seekerId) {
            setError("No Seeker ID found in session.");
            setLoading(false);
            return;
        }

        getExamHistoriesBySeekerId(headers, seekerId)
            .then((data) => {
                setHistories(data || []);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load exam history.");
                setLoading(false);
            });
    }, []);

    return (
        <Paper elevation={3} sx={{ p: 4, minHeight: "100%" }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Your Test History
            </Typography>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mt: 3 }}>
                    {error}
                </Alert>
            ) : histories.length === 0 ? (
                <Alert severity="info" sx={{ mt: 3 }}>
                    No exam history found.
                </Alert>
            ) : (
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {histories.map((history, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                elevation={3}
                                onClick={() =>
                                    navigate("/jobs/resultReview", {
                                        state: {
                                            historyId: history.id,
                                        },
                                    })
                                }
                                sx={{
                                    cursor: "pointer",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                        transform: "scale(1.02)",
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        {new Date(history.endTime).toLocaleDateString()} •{" "}
                                        {new Date(history.endTime).toLocaleTimeString()}
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600}>
                                        {history.topic?.topicName || "N/A"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Mode: {history.mode}
                                    </Typography>

                                    <Divider sx={{ my: 1 }} />

                                    <Typography variant="body2">Total Questions: {history.totalQuestions}</Typography>
                                    <Typography variant="body2">Attempted: {history.attemptedQuestions}</Typography>
                                    <Typography variant="body2">Correct: {history.correctAnswers}</Typography>
                                    <Typography variant="body2">Wrong: {history.wrongAnswers}</Typography>
                                    <Typography variant="body2">Unattempted: {history.unattempted}</Typography>
                                    <Typography variant="body2">Score: {history.score}</Typography>

                                    <Divider sx={{ my: 1 }} />

                                    <Box
                                        sx={{
                                            mt: 1,
                                            p: 1,
                                            textAlign: "center",
                                            borderRadius: 1,
                                            bgcolor: history.result?.toLowerCase() === "pass" ? "#e0f7e9" : "#fdecea",
                                            color: history.result?.toLowerCase() === "pass" ? "#2e7d32" : "#d32f2f",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {history.result}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Paper>
    );
};

export default ExamHistory;
