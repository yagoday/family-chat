import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await onLogin(username, password);
      navigate('/chat');
    } catch (err) {
      setError('שם משתמש או סיסמה שגויים 😕');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f8ff',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
          width: '90%',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#4a90e2' }}>
        היגודאים
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="שם משתמש"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="סיסמה"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              backgroundColor: '#4a90e2',
              '&:hover': {
                backgroundColor: '#357abd',
              },
            }}
          >
            כניסה 🚀
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm; 