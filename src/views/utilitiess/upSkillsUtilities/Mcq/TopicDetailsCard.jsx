import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Box, Button, Grid } from "@mui/material";

// API function to fetch topics using Axios
const fetchTopicsApi = async (moduleId, page, pageSize) => {
    try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
        };

        const url = `https://wsproducts.cloudjiffy.net/kwinlabsuser/mcqtopic/v1/getAllMCQTopicByPaginationByMCQModuleId/{pageNumber}/{pageSize}/{moduleId}?moduleId=1&pageNumber=0&pageSize=10`;

        const response = await axios.get(url, { headers });
        console.log(response.data.content);
        return response.data; // Return the entire response data
    } catch (error) {
        console.error("Error fetching topics:", error);
        return { content: [], number: 0, totalPages: 1 };
    }
};

const TopicDetailsCard = ({ moduleId }) => {
    const [topics, setTopics] = useState([]);
    const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 1 });

    useEffect(() => {
        fetchTopics(0); // Load first page when component mounts
    }, [moduleId]);

    const fetchTopics = async (page) => {
        const data = await fetchTopicsApi(moduleId, page, pagination.size);
        setTopics(data.content);
        setPagination({ page: data.number, size: data.size, totalPages: data.totalPages });
    };

    return (
        <Card
            sx={{
                mt: 2,
                borderRadius: "12px",
                boxShadow: 3,
                p: 2,
                backgroundColor: "#fff",
                width: "100%",
            }}
        >
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    Topics
                </Typography>

                {topics.length > 0 ? (
                    <Grid container spacing={2}>
                        {topics.map((topic) => (
                            <Grid item xs={12} sm={6} md={4} key={topic.topicId}>
                                <Card
                                    sx={{
                                        backgroundColor: "#f5f5f5",
                                        p: 2,
                                        borderRadius: "8px",
                                        boxShadow: 2,
                                        cursor: "pointer",
                                        "&:hover": { boxShadow: 4 },
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                            {topic.topicName}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                            {topic.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body2">No topics found for this module.</Typography>
                )}

                {/* Pagination Buttons */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button
                        onClick={() => fetchTopics(pagination.page - 1)}
                        disabled={pagination.page === 0}
                        variant="contained"
                        sx={{ mr: 1 }}
                    >
                        Prev
                    </Button>
                    <Button
                        onClick={() => fetchTopics(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages - 1}
                        variant="contained"
                    >
                        Next
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TopicDetailsCard;