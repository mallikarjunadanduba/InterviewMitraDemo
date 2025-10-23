import React from 'react';
import { Typography, Box } from '@mui/material';

const BotMessageFormatter = ({ text }) => {
  if (!text) return null;

  // Split into alternating text/code blocks using triple backticks
  const blocks = text.split(/```/);

  return (
    <Box sx={{ p: 1 }}>
      {blocks.map((block, blockIndex) => {
        const isCodeBlock = blockIndex % 2 !== 0;

        if (isCodeBlock) {
          // Code block rendering
          return (
            <Box
              key={`code-${blockIndex}`}
              component="pre"
              sx={{
                bgcolor: '#f5f5f5',
                p: 1.5,
                borderRadius: 1,
                overflowX: 'auto',
                fontFamily: 'monospace',
                mb: 2,
                fontSize: '14px',
                lineHeight: 1.4,
              }}
            >
              {block.trim()}
            </Box>
          );
        }

        // Normal text handling
        const lines = block
          .replace(/\*/g, '') // remove stray asterisks
          .replace(/([a-dA-D])\)/g, '$1) ') // ensure space after MCQ options
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);

        return lines.map((line, index) => {
          // Handle numbered lists (1., 2., etc.)
          if (/^\d+\.\s/.test(line)) {
            return (
              <Box key={`num-${blockIndex}-${index}`} sx={{ mb: 1.5 }}>
                <Typography
                  variant="body2"
                  sx={{ 
                    fontWeight: 500,
                    lineHeight: 1.6,
                    color: '#1a1a1a'
                  }}
                >
                  {line}
                </Typography>
              </Box>
            );
          }

          // Handle MCQ options (a), b), etc.)
          if (/^[a-dA-D][\.\)]\s/.test(line)) {
            return (
              <Typography
                key={`opt-${blockIndex}-${index}`}
                variant="body2"
                sx={{ 
                  ml: 3, 
                  mb: 0.5,
                  lineHeight: 1.5,
                  color: '#333'
                }}
              >
                {line}
              </Typography>
            );
          }

          // Handle bulleted lists
          if (/^[-•]\s/.test(line)) {
            return (
              <Typography
                key={`bullet-${blockIndex}-${index}`}
                variant="body2"
                sx={{ 
                  ml: 2, 
                  mb: 0.5,
                  lineHeight: 1.5,
                  color: '#333'
                }}
              >
                {line.replace(/^[-•]\s/, '• ')}
              </Typography>
            );
          }

          // Handle headings (lines ending with :)
          if (line.endsWith(':') && line.length < 50) {
            return (
              <Typography
                key={`heading-${blockIndex}-${index}`}
                variant="body1"
                sx={{ 
                  fontWeight: 600, 
                  mt: 2, 
                  mb: 1,
                  color: '#1a1a1a',
                  lineHeight: 1.4
                }}
              >
                {line}
              </Typography>
            );
          }

          // Handle paragraphs with proper spacing
          if (line.length > 0) {
            return (
              <Typography
                key={`p-${blockIndex}-${index}`}
                variant="body2"
                sx={{ 
                  mb: 1.5,
                  lineHeight: 1.6,
                  color: '#333',
                  textAlign: 'justify'
                }}
              >
                {line}
              </Typography>
            );
          }

          return null;
        });
      })}
    </Box>
  );
};

export default BotMessageFormatter;
