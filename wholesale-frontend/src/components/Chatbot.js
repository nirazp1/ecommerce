import React, { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, IconButton 
} from '@mui/material';
import { Send as SendIcon, Close as CloseIcon } from '@mui/icons-material';
import { getChatbotResponse } from '../services/aiService';

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const botResponse = await getChatbotResponse(input);
      const botMessage = { text: botResponse, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        Chat with AI
      </Button>
      {open && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: 300,
            height: 400,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">AI Assistant</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
            {messages.map((message, index) => (
              <Box key={index} sx={{ mb: 1, textAlign: message.sender === 'user' ? 'right' : 'left' }}>
                <Paper sx={{ p: 1, display: 'inline-block', maxWidth: '80%' }}>
                  <Typography>{message.text}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>
          <Box sx={{ p: 1, display: 'flex' }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <IconButton color="primary" onClick={handleSend}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
}

export default Chatbot;
