import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Paper, TextField, IconButton, Typography, Avatar, Tooltip, Chip, Container
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PersonIcon from '@mui/icons-material/Person';
import { IconBrain } from '@tabler/icons-react';
import BotMessageFormatter from './Profile/BotMessageFormatter';

const AIAgent = () => {
  const [messages, setMessages] = useState([
            { from: 'bot', text: 'Hi! I am your Interview Mitra Agent. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef(null);
  const botTextRef = useRef('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    const userMessage = file
      ? { from: 'user', text: `📎 ${file.name}`, fileUrl: URL.createObjectURL(file) }
      : { from: 'user', text: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const newBotMessage = { from: 'bot', text: '' };
    setMessages((prev) => [...prev, newBotMessage]);
    botTextRef.current = '';

    let updateInterval = null;

    try {
      let response;

      if (file) {
        const formData = new FormData();
        if (input) formData.append('message', input);
        if (file) formData.append('file', file);

        response = await fetch('http://localhost:8070/ws/ai/chat-stream-file', {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch('http://localhost:8070/ws/ai/chat-stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input }),
        });
      }

      if (!response.ok || !response.body) throw new Error('Failed to connect to SSE endpoint');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      updateInterval = setInterval(() => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.from === 'bot') {
            last.text = botTextRef.current;
          }
          return [...updated.slice(0, -1), last];
        });
      }, 50);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line.startsWith('data:')) {
            const content = line.replace(/^data:\s*/, '');
            botTextRef.current += content;
          }
        }
        buffer = lines[lines.length - 1];
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      clearInterval(updateInterval);
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.from === 'bot') {
          last.text = botTextRef.current;
        }
        return [...updated.slice(0, -1), last];
      });
      setIsLoading(false);
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    e.target.value = null;
  };

  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#ffffff',
        position: 'relative'
      }}
    >
      {/* Fixed Header */}
      <Box 
        sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderBottom: '1px solid #e5e5e5',
          bgcolor: '#ffffff',
          py: 2,
          px: 3
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: '#1a1a1a',
            textAlign: 'center'
          }}
        >
          Interview Mitra AI Agent
        </Typography>
      </Box>

      {/* Scrollable Chat Messages */}
      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          bgcolor: '#ffffff',
          mt: '64px', // Height of header
          mb: '200px' // Approximate height of footer
        }}
      >
        <Container maxWidth="md" sx={{ py: 2 }}>
          {messages.map((msg, idx) => (
            <Box 
              key={idx} 
              sx={{ 
                display: 'flex',
                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                mb: 3,
                gap: 2
              }}
            >
              {msg.from === 'bot' && (
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: '#10a37f',
                    mt: 0.5
                  }}
                >
                  <IconBrain size={16} color="white" />
                </Avatar>
              )}
              
              <Box 
                sx={{ 
                  maxWidth: '80%',
                  minWidth: '200px'
                }}
              >
                {msg.from === 'bot' ? (
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: '#f7f7f8',
                      borderRadius: '12px',
                      p: 2,
                      border: '1px solid #e5e5e5'
                    }}
                  >
                    <BotMessageFormatter text={msg.text} />
                  </Paper>
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: '#10a37f',
                      borderRadius: '12px',
                      p: 2,
                      color: 'white'
                    }}
                  >
                    {msg.fileUrl ? (
                      <Typography
                        component="a"
                        href={msg.fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          color: 'white',
                          textDecoration: 'underline',
                          '&:hover': {
                            color: '#e0e0e0'
                          }
                        }}
                      >
                        {msg.text}
                      </Typography>
                    ) : (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.5
                        }}
                      >
                        {msg.text}
                      </Typography>
                    )}
                  </Paper>
                )}
              </Box>

              {msg.from === 'user' && (
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: '#10a37f',
                    mt: 0.5
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Avatar>
              )}
            </Box>
          ))}
          <div ref={chatEndRef} />
        </Container>
      </Box>

      {/* Fixed Input Area */}
      <Box 
        sx={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderTop: '1px solid #e5e5e5',
          bgcolor: '#ffffff',
          p: 3
        }}
      >
        <Container maxWidth="md">
          {/* File Selected Indicator */}
          {file && (
            <Box 
              sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                gap: 1
              }}
            >
              <Chip
                label={file.name}
                onDelete={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = null;
                }}
                color="primary"
                variant="outlined"
                size="small"
              />
            </Box>
          )}

          {/* Input Form */}
          <Paper
            component="form"
            elevation={0}
            sx={{ 
              display: 'flex', 
              alignItems: 'flex-end',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              p: 1,
              bgcolor: '#ffffff',
              '&:focus-within': {
                borderColor: '#10a37f',
                boxShadow: '0 0 0 2px rgba(16, 163, 127, 0.1)'
              }
            }}
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <Tooltip title="Attach a file">
              <IconButton 
                component="label" 
                sx={{ 
                  p: 1,
                  color: '#666',
                  '&:hover': {
                    color: '#10a37f'
                  }
                }}
              >
                <AttachFileIcon fontSize="small" />
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={handleFileUpload}
                />
              </IconButton>
            </Tooltip>

            <TextField
              fullWidth
              multiline
              maxRows={4}
              variant="standard"
              placeholder="Message Interview Mitra AI Agent..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                disableUnderline: true,
                style: { 
                  padding: '8px 12px',
                  fontSize: '16px',
                  lineHeight: 1.5
                },
              }}
              disabled={isLoading}
              sx={{
                '& .MuiInputBase-root': {
                  minHeight: '44px'
                }
              }}
            />

            <IconButton 
              color="primary" 
              type="submit" 
              disabled={isLoading || (!input.trim() && !file)}
              sx={{ 
                p: 1,
                color: (!input.trim() && !file) ? '#ccc' : '#10a37f',
                '&:hover': {
                  bgcolor: 'rgba(16, 163, 127, 0.1)'
                }
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Paper>

          {/* Footer Text */}
          <Typography 
            variant="caption" 
            sx={{ 
              mt: 1, 
              textAlign: 'center',
              color: '#666',
              display: 'block'
            }}
          >
            Interview Mitra AI Agent can make mistakes. Consider checking important information.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default AIAgent;
