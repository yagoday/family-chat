import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/api';
import LogoutIcon from '@mui/icons-material/Logout';

interface HeaderProps {
  displayName: string;
  isOnline: boolean;
  avatar: string;
}

const Header: React.FC<HeaderProps> = ({ displayName, isOnline, avatar }) => {
  const handleLogout = async () => {
    try {
      await auth.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('התנתקות נכשלה:', error);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#4a90e2' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          היגודאים
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Avatar
              src={avatar}
              alt={displayName}
              sx={{
                width: 40,
                height: 40,
                marginRight: 1,
                border: isOnline ? '2px solid #4caf50' : '2px solid #bdbdbd'
              }}
            />
            <Typography variant="body1">{displayName}</Typography>
          </Box>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon sx={{ ml: 1 }} />}
          >
            התנתק
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 