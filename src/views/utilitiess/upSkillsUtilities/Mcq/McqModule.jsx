import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box, IconButton, Alert, Pagination, Button } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { fetchMcqByCategoryId, fetchMcqByModuleId } from 'views/API/McqCategoryApi';

const McqModule = () => {
    const theme = useTheme();
    const location = useLocation();
    const { categoryId, categoryName } = location.state || {};
    const [modules, setModules] = useState([]);
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [topics, setTopics] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const topicsPerPage = 5;
    const [error, setError] = useState(null);
    const [topicError, setTopicError] = useState(null);
    const [noTopicsError, setNoTopicsError] = useState(null); // New state for no topics error

    useEffect(() => {
        if (!categoryId) return;

        const fetchData = async () => {
            try {
                const user = JSON.parse(sessionStorage.getItem('user'));
                const headers = {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer ' + user?.accessToken
                };

                const response = await fetchMcqByCategoryId(headers, categoryId);
                if (response.data.length > 0) {
                    setModules(response.data);
                    setSelectedModuleId(response.data[0].moduleId);
                    fetchTopics(response.data[0].moduleId);
                } else {
                    setModules([]);
                    setError('No modules found for this category.');
                }
            } catch (error) {
                console.error('Error fetching MCQs:', error);
                setError('Failed to fetch modules.');
            }
        };

        fetchData();
    }, [categoryId]);

    const handleModuleClick = (moduleId) => {
        setSelectedModuleId(moduleId);
        setCurrentPage(1);
        fetchTopics(moduleId);
    };

    const fetchTopics = async (moduleId) => {
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            const headers = {
                'Content-type': 'application/json',
                Authorization: 'Bearer ' + user?.accessToken
            };

            const response = await fetchMcqByModuleId(headers, moduleId, 0, 10);
            if (response.data.content.length === 0) {
                setNoTopicsError('No topics found for this module.'); // Set error if no topics
            } else {
                setNoTopicsError(null); // Clear error if topics are found
            }
            setTopics((prevTopics) => ({ ...prevTopics, [moduleId]: response.data.content }));
            setTopicError(null); // Clear error if successful
        } catch (error) {
            console.error('Error fetching topics:', error);
            setTopicError('Failed to fetch topics.');
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <>
          <Card sx={{  boxShadow: 'none',backgroundColor:"white" }}>
            <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: "black", mb: 2, }}>
                    MCQ Modules - {categoryName}
                </Typography>
            </CardContent>
            </Card>
            {error && <Alert severity="error">{error}</Alert>}
               <br/>
            {/* Module Selection (Top Buttons) */}
            <Box sx={{ 
                display: 'flex', 
                overflowX: 'auto', // Enable horizontal scrolling
                gap: 2, 
                mb: 3,
                '&::-webkit-scrollbar': {
                    height: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#00afb5',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f0f0f0',
                }
            }}>
                {modules.map((module) => (
                    <Button
                        key={module.moduleId}
                        onClick={() => handleModuleClick(module.moduleId)}
                        sx={{
                            flex: '0 0 auto', // Prevent buttons from shrinking
                            backgroundColor: selectedModuleId === module.moduleId ? '#00afb5' : 'white',
                            color: selectedModuleId === module.moduleId ? 'white' : 'black',
                            fontWeight: 'bold',
                            borderRadius: '24px',
                            padding: '10px 20px',
                            border: selectedModuleId === module.moduleId ? '2px solid white' : '2px solid transparent',
                            '&:hover': { backgroundColor: '#008b8b', transform: 'scale(1.05)' }
                        }}
                    >
                        {module.moduleName}
                    </Button>
                ))}
            </Box>

            {/* Topics List */}
            <MainCard sx={{ mt: 2, backgroundColor: 'transparent' }}>
                {topicError ? (
                    <Alert severity="error">{topicError}</Alert>
                ) : noTopicsError ? (
                    <Alert severity="info">{noTopicsError}</Alert>
                ) : selectedModuleId && topics[selectedModuleId] ? (
                    <Grid container spacing={2}>
                        {topics[selectedModuleId].slice((currentPage - 1) * topicsPerPage, currentPage * topicsPerPage).map((topic) => (
                            <Grid item xs={12} key={topic.topicId}>
                                <Card
                                    sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        alignItems: 'center',
                                        p: 1.5,
                                        boxShadow: 2,
                                        borderRadius: '12px',
                                        background: '#ffffff',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            boxShadow: 5,
                                            transform: 'scale(1.02)'
                                        }
                                    }}
                                >

                                    {/* Content Section */}
                                    <Box
                                        sx={{
                                            flex: 1,
                                            pl: { sm: 2 },
                                            textAlign: 'left'
                                        }}
                                    >
                                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#000' }}>
                                            {topic.topicName}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#555' }}>
                                            {topic.description}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}

                        {/* Pagination */}
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                            <Pagination
                                count={Math.ceil(topics[selectedModuleId].length / topicsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                variant="outlined"
                                shape="rounded"
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="body2" sx={{ color: '#777', mt: 2 }}>
                        No topics found for the selected module.
                    </Typography>
                )}
            </MainCard>
       
        </>
       
    );
};

export default McqModule;