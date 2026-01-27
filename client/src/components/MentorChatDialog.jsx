// MentorChatDialog.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Button, Input,Typography } from '@mui/material';

const MentorChatDialog = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false); 
  const [userId] = useState(uuidv4()); // unique session ID
  const API_BASE = 'https://magic-cindy.fly.dev';

  const queryMentor = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/mentor-chat`, {
        userId,
        userInput: prompt,
      });
      setResponse(res.data.answer);
    } catch (err) {
      console.error('Error querying mentor:', err);
      alert('Failed to query mentor. Check console.');
    }
    setLoading(false);
  };

  return ( 
    <div style={{ 
      padding: 'clamp(0.5rem, 2vw, 1rem)', 
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      minHeight: '0', // Important for iframe compatibility
      height: '100%'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        width: '100%'
      }}>
        <Input
          type="text"
          value={prompt}
          sx={{
            fontFamily: 'MadeTommy',
            color: 'white',
            fontSize: 'clamp(14px, 2vw, 15px) !important',
            width: '100%',
            boxSizing: 'border-box',
            '& .MuiInput-input': {
              padding: 'clamp(8px, 1.5vw, 10px)',
            }
          }}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a question about Cindy's Career MAGIC Book!"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !loading && prompt.trim()) {
              queryMentor();
            }
          }}
        />
        <Button 
          sx={{
            backgroundColor: 'white',
            color: 'black',
            fontFamily: 'MadeTommyBold',
            fontSize: 'clamp(14px, 2vw, 15px) !important',
            padding: 'clamp(10px, 2vw, 12px)',
            width: '100%',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            },
            '&:disabled': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)'
            }
          }} 
          onClick={queryMentor} 
          disabled={loading || !prompt.trim()}
        >
          {loading ? 'Querying...' : 'Send'}
        </Button>
      </div>

      {response && (
        <div style={{ 
          marginTop: 'clamp(1rem, 3vw, 1.5rem)',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'auto',
          maxHeight: 'calc(100vh - 200px)', // Prevents overflow in iframes
          wordWrap: 'break-word'
        }}>
          <Typography 
            variant="body1" 
            fontFamily='MadeTommyBold' 
            sx={{
              padding: 'clamp(0.5rem, 2vw, 1rem)',
              fontSize: 'clamp(16px, 2.5vw, 18px)'
            }}
          >
            Cindy's Response:
          </Typography>
          <Typography 
            variant="body2" 
            fontFamily='MadeTommy' 
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: 'clamp(14px, 2vw, 16px)',
              padding: '0 clamp(0.5rem, 2vw, 1rem)',
              lineHeight: '1.6'
            }}
          >
            {response}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default MentorChatDialog;
