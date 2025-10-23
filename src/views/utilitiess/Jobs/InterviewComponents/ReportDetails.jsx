import React, { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { downloadReportFile, fetchFinalReport } from '../../../API/Interview/reportApi';


const ReportDetails = () => {
  const { sessionId } = useParams(); // expects route like /final_report/:sessionId
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadFile, setDownloadFile] = useState('');

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      try {
        const response = await fetchFinalReport(sessionId);
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setReport(response.data.report || response.data);
          setDownloadFile(response.data.filename || '');
        }
      } catch (err) {
        setError('Failed to load report.');
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [sessionId]);

  const handleDownload = async () => {
    try {
      const res = await downloadReportFile(downloadFile);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', downloadFile);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Download failed.');
    }
  };

  if (loading) {
    return <CircularProgress sx={{ mt: 4 }} />;
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  }

  if (!report) {
    return <Alert severity="info" sx={{ mt: 4 }}>No report available.</Alert>;
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Details by Category
      </Typography>

      <Paper elevation={2} sx={{ p: 3 }}>
        <List>
          {Object.entries(report).map(([category, questions]) => (
            <Box key={category} mb={2}>
              <Typography variant="h6" fontWeight="bold">
                {category}
              </Typography>
              <List disablePadding>
                {Object.entries(questions).map(([question, res], index) => (
                  <Box key={index} mt={2}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <>
                            <strong>Question:</strong> {question}<br />
                            <strong>Answer:</strong> {res.transcript}<br />
                            <strong>Sentiment:</strong> {res.sentiment} ({res.score.toFixed(2)})<br />
                            <strong>Score:</strong> {res.score.toFixed(2)}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </Box>
                ))}
              </List>
            </Box>
          ))}
        </List>

        {downloadFile && (
          <Box mt={4} textAlign="center">
            <Button variant="outlined" color="primary" onClick={handleDownload}>
              📥 Download Report File
            </Button>
          </Box>
        )}
      </Paper>
    </>
  );
};

export default ReportDetails;
