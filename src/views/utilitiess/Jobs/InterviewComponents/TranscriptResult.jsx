import React from 'react';
import { Typography, Box } from '@mui/material';

const TranscriptResult = ({ response, loading }) => {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.8rem',
            mb: 0.5,
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Transcript:
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1rem',
            lineHeight: 1.5,
            fontWeight: 400,
            fontStyle: 'italic'
          }}
        >
          Processing...
        </Typography>
      </Box>
    );
  }

  if (!response) {
    return (
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            fontWeight: 400
          }}
        >
          Your response will appear here after recording...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', width: '100%' }}>
      {response.transcript && (
        <>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.8rem',
              mb: 0.5,
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Transcript:
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              fontSize: '1rem',
              lineHeight: 1.5,
              fontWeight: 400,
              wordBreak: 'break-word'
            }}
          >
            {response.transcript}
          </Typography>
        </>
      )}

      {response.resume_summary && (
        <Box 
          mt={2} 
          p={2} 
          sx={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2, 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}
        >
          <Typography 
            variant="subtitle1" 
            fontWeight="600" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.9rem',
              mb: 1
            }}
          >
            📄 Resume Summary:
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              whiteSpace: 'pre-wrap',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.9rem',
              lineHeight: 1.5
            }}
          >
            {response.resume_summary}
          </Typography>
        </Box>
      )}

      {response.error && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#ff6b6b',
            fontSize: '0.9rem',
            fontWeight: 500
          }}
        >
          {response.error}
        </Typography>
      )}
    </Box>
  );
};


export default TranscriptResult;
