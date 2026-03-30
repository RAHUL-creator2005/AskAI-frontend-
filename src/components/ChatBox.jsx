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
        p: { xs: 1.2, md: 2 }, // Even tighter on mobile!
        px: { xs: 2, md: 4 }, 
        borderBottom: '1px solid #1e2229', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.2,
        bgcolor: '#111419' 
      }}>
        <Avatar sx={{ bgcolor: '#3b82f6', width: { xs: 28, md: 32 }, height: { xs: 28, md: 32 } }}>
          <SmartToyIcon sx={{ fontSize: { xs: 16, md: 20 } }} />
        </Avatar>
        <Typography variant="h6" fontWeight="700" sx={{ color: '#ffffff', letterSpacing: '0.5px', fontSize: { xs: '1.1rem', md: '1.25rem' } }}>AskAI</Typography>
        <Typography variant="caption" sx={{ ml: 'auto', color: '#6b7280', display: { xs: 'none', sm: 'block' } }}>Global Interface Active</Typography>
      </Box>


      {/* Messages Area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        p: { xs: 1.5, md: 3 }, // Reduced from 5 on desktop
        display: 'flex', 
        flexDirection: 'column', 
        gap: { xs: 1.5, md: 2 },
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
              maxWidth: { xs: '90%', md: '85%' } // Increased from 70% to use space better
            }}>
              {msg.sender === 'ai' && (
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#1e2229', color: '#888', border: '1px solid #2d333d' }}>
                  <SmartToyIcon sx={{ fontSize: 18 }} />
                </Avatar>
              )}
              <Box sx={{ 
                p: { xs: 1.2, md: 2.5 }, // Tight internal padding for mobile efficiency
                borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', // Slightly smaller radius
                bgcolor: msg.sender === 'user' ? '#3b82f6' : '#1e2229',
                color: msg.sender === 'user' ? 'white' : '#e0e0e0',
                fontSize: { xs: '0.92rem', md: '1rem' }, // Optimized font size
                lineHeight: 1.5,
                boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
                border: msg.sender === 'ai' ? '1px solid #2d333d' : 'none',
                // Custom styles for Markdown content
                '& p': { m: 0, mb: 0.8 },
                '& p:last-child': { mb: 0 },
                '& ol, & ul': { pl: 2, m: 0 },
                '& li': { mb: 0.3 },
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
      <Box sx={{ p: { xs: 1.5, md: 2.5 }, pt: 0, bgcolor: 'transparent' }}>
        <Box sx={{ 
          maxWidth: '1000px', 
          margin: '0 auto',
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.2, 
          bgcolor: '#1e2229', 
          p: 0.8, 
          borderRadius: '28px', // Slightly tighter radius
          px: { xs: 2, md: 3 },
          border: '1px solid #2d333d',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <TextField 
            fullWidth 
            multiline 
            maxRows={4} // Reduced from 6 to save space
            variant="standard"
            placeholder="Type your message..." 
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
              sx: { py: { xs: 1, md: 1.5 }, color: '#f3f4f6', fontSize: '0.95rem' } 
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
            disabled={!input.trim() || isLoading}
            sx={{ 
              bgcolor: input.trim() ? '#3b82f6' : '#2d333d', 
              color: 'white',
              '&:hover': { bgcolor: input.trim() ? '#2563eb' : '#2d333d' },
              transition: 'all 0.2s',
              width: { xs: 40, md: 48 },
              height: { xs: 40, md: 48 }
            }}
          >
            <SendIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
          </IconButton>
        </Box>
        <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'center', mt: 1.5, color: '#4b5563' }}>
          Global AI Assistant &bull; Always listening &bull; Powered by OpenRouter
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatBox;
