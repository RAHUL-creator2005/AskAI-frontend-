import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Avatar, Fade } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ReactMarkdown from 'react-markdown';
import { askAI } from '../services/api.js';


const ChatBox = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'ai', metadata: {} }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = { text: input, sender: 'user', metadata: {} };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        const response = await askAI(input);
        if (response.success) {
          setMessages(prev => [...prev, { 
            text: response.data.content, 
            sender: 'ai',
            metadata: response.metadata 
          }]);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        setMessages(prev => [...prev, { 
          text: "Sorry, I'm having trouble connecting to the server. Please check if the backend is running.", 
          sender: 'ai',
          metadata: { error: true }
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw', // Truly Full Width
      bgcolor: '#0f1115', 
      color: '#e0e0e0',
      position: 'relative'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        px: { xs: 2, md: 4 }, // Responsive padding for mobile!
        borderBottom: '1px solid #1e2229', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5,
        bgcolor: '#111419' 
      }}>
        <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32 }}>
          <SmartToyIcon fontSize="small" />
        </Avatar>
        <Typography variant="h6" fontWeight="700" sx={{ color: '#ffffff', letterSpacing: '1px' }}>AskAI</Typography>
        <Typography variant="caption" sx={{ ml: 'auto', color: '#6b7280' }}>Global Interface Active</Typography>
      </Box>


      {/* Messages Area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        p: { xs: 2, md: 5 }, // Adaptive padding for "global" feel
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' }
      }}>
        {messages.map((msg, index) => (
          <Fade in={true} key={index}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row', 
              alignItems: 'flex-end', 
              gap: 2,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: { xs: '90%', md: '70%' } // Allow breathing room on larger screens
            }}>
              {msg.sender === 'ai' && (
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#1e2229', color: '#888', border: '1px solid #2d333d' }}>
                  <SmartToyIcon sx={{ fontSize: 18 }} />
                </Avatar>
              )}
              <Box sx={{ 
                p: { xs: 1.8, md: 2.5 }, // Smaller padding on mobile
                borderRadius: msg.sender === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                bgcolor: msg.sender === 'user' ? '#3b82f6' : '#1e2229',
                color: msg.sender === 'user' ? 'white' : '#e0e0e0',
                fontSize: { xs: '0.95rem', md: '1rem' }, // Responsive font
                lineHeight: 1.6,
                boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
                border: msg.sender === 'ai' ? '1px solid #2d333d' : 'none',
                // Custom styles for Markdown content
                '& p': { m: 0, mb: 1 },
                '& p:last-child': { mb: 0 },
                '& ol, & ul': { pl: 2.5, m: 0 },
                '& li': { mb: 0.5 },
                '& strong': { color: msg.sender === 'user' ? 'white' : '#ffffff' }
              }}>
                {msg.sender === 'ai' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </Box>
              {msg.sender === 'user' && (
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#0ea5e9', color: 'white' }}>
                  <PersonIcon sx={{ fontSize: 18 }} />
                </Avatar>
              )}
            </Box>
          </Fade>
        ))}
        {/* Loading Indicator */}
        {isLoading && (
          <Fade in={true}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#1e2229', border: '1px solid #2d333d' }}>
                <SmartToyIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
              </Avatar>
              <Box sx={{ 
                display: 'flex', 
                gap: 0.5, 
                p: 2, 
                bgcolor: '#1e2229', 
                borderRadius: '24px 24px 24px 4px',
                border: '1px solid #2d333d'
              }}>
                <Box sx={{ width: 8, height: 8, bgcolor: '#6b7280', borderRadius: '50%', animation: 'pulse 1.5s infinite ease-in-out' }} />
                <Box sx={{ width: 8, height: 8, bgcolor: '#6b7280', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.2s ease-in-out' }} />
                <Box sx={{ width: 8, height: 8, bgcolor: '#6b7280', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.4s ease-in-out' }} />
              </Box>
            </Box>
          </Fade>
        )}
        <div ref={messagesEndRef} />
        
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 0.3; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.2); }
            }
          `}
        </style>
      </Box>

      {/* Input Area - Full Width Sticky */}
      <Box sx={{ p: { xs: 2, md: 4 }, pt: 0, bgcolor: 'transparent' }}>
        <Box sx={{ 
          maxWidth: '1000px', // Center the input bar on very large screens for usability
          margin: '0 auto',
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          bgcolor: '#1e2229', 
          p: 1, 
          borderRadius: '32px',
          px: 3,
          border: '1px solid #2d333d',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <TextField 
            fullWidth 
            multiline 
            maxRows={6}
            variant="standard"
            placeholder="Type your message here..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            InputProps={{ 
              disableUnderline: true, 
              sx: { py: 1.5, color: '#f3f4f6', fontSize: '1rem' } 
            }}
            sx={{
              "& .MuiInputBase-input::placeholder": {
                color: "#6b7280",
                opacity: 1
              }
            }}
          />
          <IconButton 
            onClick={handleSend} 
            disabled={!input.trim()}
            sx={{ 
              bgcolor: input.trim() ? '#3b82f6' : '#2d333d', 
              color: 'white',
              '&:hover': { bgcolor: input.trim() ? '#2563eb' : '#2d333d' },
              transition: 'all 0.2s',
              width: 48,
              height: 48
            }}
          >
            <SendIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Box>
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1.5, color: '#4b5563' }}>
          Global AI Assistant &bull; Always listening &bull; Powered by OpenRouter
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatBox;
