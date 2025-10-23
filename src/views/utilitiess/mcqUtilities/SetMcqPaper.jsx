import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Checkbox, ListItemText } from '@mui/material';
import { fetchMcqCategories, fetchStreamCategoryId, fetchTopicsByStreamId } from '../../API/SetPaperAPi';
import MainCard from 'ui-component/cards/MainCard';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from 'BaseUrl';

const SetPaper = () => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [mode, setMode] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState();

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + user.accessToken
  };
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await fetchMcqCategories(headers);
      const fetchedData = res.data;
      if (fetchedData) {
        const categoryData = fetchedData.map((p) => ({
          categoryId: p.categoryId,
          categoryName: p.categoryName
        }));
        setCategories(categoryData);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStreams = async (categoryId) => {
    try {
      const res = await fetchStreamCategoryId(headers, categoryId);
      const fetchedData = res.data;
      if (fetchedData) {
        const streamData = fetchedData.map((p) => ({
          streamId: p.streamId,
          streamName: p.streamName
        }));
        setStreams(streamData);
        if (streamData.length > 0) {
          setSelectedStream(streamData[0].streamId);
          await fetchTopics(streamData[0].streamId);
        } else {
          setSelectedStream('');
          setTopics([]);
          setSelectedTopics([]);
        }
      } else {
        setStreams([]);
        setSelectedStream('');
        setTopics([]);
        setSelectedTopics([]);
      }
    } catch (error) {
      console.error('Error fetching streams:', error);
      setStreams([]);
      setSelectedStream('');
      setTopics([]);
      setSelectedTopics([]);
    }
  };

  const fetchTopics = async (streamId) => {
    try {
      const res = await fetchTopicsByStreamId(headers, streamId);
      const fetchedData = res.data;
      if (fetchedData) {
        const topicsData = fetchedData.map((p) => ({
          topicId: p.topicId,
          topicName: p.topicName
        }));
        setTopics(topicsData);
      } else {
        setTopics([]);
        setSelectedTopics([]);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopics([]);
      setSelectedTopics([]);
    }
  };

  const handleCategoryChange = async (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    sessionStorage.setItem('selectedCategoryId', categoryId);
    if (categoryId) {
      await fetchStreams(categoryId);
    } else {
      setStreams([]);
      setSelectedStream('');
      setTopics([]);
      setSelectedTopics([]);
    }
  };

  const handleStreamChange = async (event) => {
    const streamId = event.target.value;
    setSelectedStream(streamId);
    if (streamId) {
      await fetchTopics(streamId);
    } else {
      setTopics([]);
      setSelectedTopics([]);
    }
  };

  const handleTopicsChange = (event) => {
    const {
      target: { value }
    } = event;
    setSelectedTopics(typeof value === 'string' ? value.split(',') : value);
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleNumberOfQuestionsChange = (event) => {
    setNumberOfQuestions(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // const handleDetails = async () => {
  //   const selectedTopicsList = selectedTopics.map((topicId) => ({ topicId }));
  //   const payload = {
  //     mcqtopicDTOList: selectedTopicsList,
  //     mode,
  //     numberOfQuestions
  //   };

  //   try {
  //     const response = await fetch('https://virtullearning.cloudjiffy.net/edukartorg/mcqfile/v1/getMCQDataByMCQDataRequest', {
  //       method: 'POST',
  //       headers,
  //       body: JSON.stringify(payload)
  //     });
  //     // console.log(response);
  //     const data = await response.json();
  //     if (response.ok) {
  //       alert('success');
  //       console.log('Success:', data);
  //       navigate('details');
  //     } else {
  //       console.error('Error:', data);
  //     }
  //   } catch (error) {
  //     console.error('Request failed:', error);
  //   }
  // };

  const handleDetails = async () => {
    const selectedTopicsList = selectedTopics.map((topicId) => ({ topicId }));
    const payload = {
      mcqtopicDTOList: selectedTopicsList,
      mode,
      numberOfQuestions
    };

    try {
      const response = await fetch(`${BaseUrl}/mcqfile/v1/getMCQDataByMCQDataRequest`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem('mcqResponseData', JSON.stringify(data));
        // alert('success');
        console.log('Success:', data);
        navigate('details');
      } else {
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };
  return (
    <MainCard title="Set Question Paper">
      {/* Categories */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={2}>
          <Typography sx={{ fontWeight: 400, fontSize: 15 }}>MCQ Category:</Typography>
        </Grid>
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth size="medium">
            <InputLabel id="category-select-label">Select Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              label="Select Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">
                <em>select</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Streams */}
      {streams.length > 0 && (
        <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
          <Grid item xs={12} sm={2}>
            <Typography sx={{ fontWeight: 400, fontSize: 15 }}>MCQ Stream:</Typography>
          </Grid>
          <Grid item xs={12} sm={10}>
            <FormControl fullWidth size="medium">
              <InputLabel id="stream-select-label">Select Stream</InputLabel>
              <Select
                labelId="stream-select-label"
                id="stream-select"
                value={selectedStream}
                label="Select Stream"
                onChange={handleStreamChange}
              >
                <MenuItem value="">
                  <em>select</em>
                </MenuItem>
                {streams.map((stream) => (
                  <MenuItem key={stream.streamId} value={stream.streamId}>
                    {stream.streamName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}

      {/* Topics */}
      {topics.length > 0 && (
        <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
          <Grid item xs={12} sm={2}>
            <Typography sx={{ fontWeight: 400, fontSize: 15 }}>MCQ Topics:</Typography>
          </Grid>
          <Grid item xs={12} sm={10}>
            <FormControl fullWidth size="medium">
              <InputLabel id="topics-select-label">Select Topic</InputLabel>
              <Select
                labelId="topics-select-label"
                id="topics-select"
                multiple
                value={selectedTopics}
                label="Select Topic"
                onChange={handleTopicsChange}
                renderValue={(selected) =>
                  selected.map((topicId) => topics.find((topic) => topic.topicId === topicId)?.topicName).join(', ')
                }
              >
                {topics.map((topic) => (
                  <MenuItem key={topic.topicId} value={topic.topicId}>
                    <Checkbox checked={selectedTopics.indexOf(topic.topicId) > -1} />
                    <ListItemText primary={topic.topicName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}

      {/* Mode */}
      <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Grid item xs={12} sm={2}>
          <Typography sx={{ fontWeight: 400, fontSize: 15 }}>Mode:</Typography>
        </Grid>
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth size="medium">
            <InputLabel id="mode-select-label">Select Mode</InputLabel>
            <Select labelId="mode-select-label" id="mode-select" value={mode} label="Select Mode" onChange={handleModeChange}>
              <MenuItem value="">
                <em>select</em>
              </MenuItem>
              <MenuItem value="easy">easy</MenuItem>
              <MenuItem value="medium">medium</MenuItem>
              <MenuItem value="hard">hard</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* No. of Questions */}
      <Grid container spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Grid item xs={12} sm={2}>
          <Typography sx={{ fontWeight: 400, fontSize: 15 }}>No. of Questions:</Typography>
        </Grid>
        <Grid item xs={12} sm={10}>
          <FormControl fullWidth size="medium">
            <TextField
              id="outlined-basic"
              type="number"
              label="Enter number of questions"
              variant="outlined"
              value={numberOfQuestions}
              onChange={handleNumberOfQuestionsChange}
            />
          </FormControl>
        </Grid>
      </Grid>

      {/* Submit Button */}
      {/* <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleDetails}>
            Submit
          </Button>
        </Grid>
      </Grid> */}
      {/* Submit Button */}
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDetails}
          disabled={!selectedCategory || !selectedStream || !selectedTopics.length || !mode || !numberOfQuestions}
        >
          Get Details
        </Button>
      </Grid>
    </MainCard>
  );
};

export default SetPaper;
