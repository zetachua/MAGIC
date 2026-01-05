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
    <div style={{ padding: '1rem', width:'600px', margin: '0 auto' }}>
      <Input
        type="text"
        value={prompt}
        sx={{fontFamily:'MadeTommy',color:'white',fontSize:'15px!important'}}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask a question about Cindy's Career MAGIC Book!"
        style={{ padding: '10px', width: '70%', marginRight: '10px' }}
      />
      <Button sx={{backgroundColor:'white',color:'black',fontFamily:'MadeTommyBold',fontSize:'15px!important'}} onClick={queryMentor} disabled={loading}>
        {loading ? 'Querying...' : 'Send'}
      </Button>

      {response && (
        <div style={{ marginTop: '20px' }}>
          <h3>Cindy's Response:</h3>
          <Typography variant='MadeTommy' style={{ whiteSpace: 'pre-wrap' }}>{response}</Typography>
        </div>
      )}
    </div>
  );
};

export default MentorChatDialog;
