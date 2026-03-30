import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Avatar, Fade } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { askAI } from '../services/api.js';


const ChatBox = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Real AI response call
      try {
        const aiResponse = await askAI(input);
        setMessages(prev => [...prev, { 
          text: aiResponse.content, 
          sender: 'ai' 
        }]);
      } catch (error) {
        setMessages(prev => [...prev, { 
          text: "Sorry, I'm having trouble connecting to the server. Please check if the backend is running.", 
          sender: 'ai' 
        }]);
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
        px: 4, 
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
                p: 2.5, 
                borderRadius: msg.sender === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                bgcolor: msg.sender === 'user' ? '#3b82f6' : '#1e2229',
                color: msg.sender === 'user' ? 'white' : '#e0e0e0',
                fontSize: '1rem',
                lineHeight: 1.6,
                boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
                border: msg.sender === 'ai' ? '1px solid #2d333d' : 'none'
              }}>
                {msg.text}
              </Box>
              {msg.sender === 'user' && (
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#0ea5e9', color: 'white' }}>
                  <PersonIcon sx={{ fontSize: 18 }} />
                </Avatar>
              )}
            </Box>
          </Fade>
        ))}
        <div ref={messagesEndRef} />
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
