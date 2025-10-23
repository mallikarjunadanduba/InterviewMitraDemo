import React, { useRef, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { uploadInterviewResponse } from '../../../API/Interview/interviewApi';

const RecorderControls = ({ stream, sessionId, questionData, onNext, setResponse, setLoading }) => {
  const recorderRef = useRef(null);
  const chunks = useRef([]);
  const timerRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  // Debug logging for props
  console.log("RecorderControls props:", {
    sessionId,
    questionData,
    hasStream: !!stream,
    questionDataKeys: questionData ? Object.keys(questionData) : 'null',
    questionDataValues: questionData ? {
      category: questionData.category,
      text: questionData.text,
      textLength: questionData.text?.length
    } : 'null'
  });

  // Start the timer
  const startTimer = () => {
    setSeconds(0);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  // Stop the timer
  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  const startRecording = () => {
    // Check if we have valid question data before starting recording
    if (!questionData || !questionData.category || !questionData.text || 
        questionData.category.trim() === '' || questionData.text.trim() === '') {
      console.error("Cannot start recording: Question data not ready");
      setResponse({ error: "Please wait for the question to load before recording." });
      return;
    }

    chunks.current = [];
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    recorder.onstop = async () => {
      stopTimer();
      const blob = new Blob(chunks.current, { type: 'video/webm' });
      
      // Validate required data before creating FormData
      if (!sessionId) {
        console.error("Session ID is missing");
        setResponse({ error: "Session ID is missing. Please refresh and try again." });
        setLoading(false);
        return;
      }
      
      if (!questionData || !questionData.category || !questionData.text || 
          questionData.category.trim() === '' || questionData.text.trim() === '') {
        console.error("Question data is missing or incomplete:", questionData);
        setResponse({ error: "Question data is missing. Please wait for the question to load or refresh the page." });
        setLoading(false);
        return;
      }
      
      if (blob.size === 0) {
        console.error("Video blob is empty");
        setResponse({ error: "No video recorded. Please try recording again." });
        setLoading(false);
        return;
      }
      
      // Check file size (limit to 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (blob.size > maxSize) {
        console.error("Video file too large:", blob.size);
        setResponse({ error: "Video file is too large. Please record a shorter video." });
        setLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('category', questionData.category);
      formData.append('question', questionData.text);
      formData.append('video', blob, 'response.webm'); // Add filename for better server handling

      setLoading(true);
      try {
        console.log("Uploading video:", {
          sessionId,
          category: questionData.category,
          questionLength: questionData.text.length,
          videoSize: blob.size,
          videoType: blob.type
        });
        
        const data = await uploadInterviewResponse(formData);
        setResponse(data);
        setIsUploadComplete(true); // Enable "Next" button
      } catch (err) {
        console.error("Upload failed:", err);
        
        // Enhanced error logging
        let errorMessage = "Upload failed";
        if (err.response) {
          console.error("Server response:", err.response.data);
          console.error("Status:", err.response.status);
          
          // Handle specific error cases
          if (err.response.status === 422) {
            errorMessage = "Server validation error. Please check your data and try again.";
            if (err.response.data && err.response.data.detail) {
              errorMessage += ` Details: ${JSON.stringify(err.response.data.detail)}`;
            }
          } else if (err.response.status === 413) {
            errorMessage = "Video file is too large. Please record a shorter video.";
          } else if (err.response.status === 415) {
            errorMessage = "Unsupported video format. Please try recording again.";
          }
        } else if (err.request) {
          console.error("Network error:", err.request);
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          console.error("Error:", err.message);
        }
        
        setResponse({ error: errorMessage });
      }
      setLoading(false);
    };

    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
    setIsUploadComplete(false);
    startTimer();
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Check if question data is ready
  const isQuestionReady = questionData && questionData.category && questionData.text && 
                         questionData.category.trim() !== '' && questionData.text.trim() !== '';

  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" flexWrap="wrap">
      {!isRecording ? (
        <Button 
          onClick={startRecording} 
          variant="contained" 
          disabled={!isQuestionReady}
          sx={{
            background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
            color: 'white',
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontSize: '0.9rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(0, 184, 148, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #00a085 0%, #00b7b3 100%)',
              boxShadow: '0 6px 16px rgba(0, 184, 148, 0.4)'
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.5)',
              boxShadow: 'none'
            }
          }}
        >
          🎥 Start Recording
        </Button>
      ) : (
        <>
          <Button 
            onClick={stopRecording} 
            variant="contained" 
            sx={{
              background: 'linear-gradient(135deg, #ff4757 0%, #ff6b7a 100%)',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(255, 71, 87, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ff3742 0%, #ff5a6b 100%)',
                boxShadow: '0 6px 16px rgba(255, 71, 87, 0.4)'
              }
            }}
          >
            ⏹ Stop Recording
          </Button>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '0.9rem',
              fontWeight: 500,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              px: 2,
              py: 1,
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            ⏱ {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
          </Typography>
        </>
      )}

      {isUploadComplete && (
        <Button 
          onClick={onNext} 
          variant="outlined" 
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontSize: '0.9rem',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }
          }}
        >
          👉 Next Question
        </Button>
      )}
    </Stack>
  );
};

export default RecorderControls;
