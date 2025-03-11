import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Menu, MenuItem, Box, Avatar } from '@mui/material';
import { auth } from '../../services/api';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface HeaderProps {
  displayName: string;
  isOnline: boolean;
  avatar: string;
}

const Header: React.FC<HeaderProps> = ({ displayName, isOnline, avatar }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            marginRight: 2,
            flexGrow: 0
          }}
        >
          היגודאים
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            marginLeft: 2,
            cursor: 'pointer',
            '&:hover': {
              '& .MuiSvgIcon-root': {
                transform: 'translateY(2px)'
              }
            }
          }}
          onClick={handleClick}
        >
          <Typography variant="body1">{displayName}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={avatar}
              alt={displayName}
              sx={{
                width: 40,
                height: 40,
                border: isOnline ? '2px solid #4caf50' : '2px solid #bdbdbd'
              }}
            />
            <KeyboardArrowDownIcon 
              sx={{ 
                fontSize: 20, 
                marginRight: -1,
                transition: 'transform 0.2s',
                color: 'rgba(255, 255, 255, 0.8)'
              }} 
            />
          </Box>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            '& .MuiPaper-root': {
              minWidth: '120px',
              marginTop: 1,
              boxShadow: '0px 2px 8px rgba(0,0,0,0.15)'
            }
          }}
        >
          <MenuItem 
            onClick={() => { handleClose(); handleLogout(); }}
            sx={{ 
              fontSize: '0.9rem',
              py: 1
            }}
          >
            <LogoutIcon sx={{ ml: 1, fontSize: '1.1rem' }} />
            התנתק
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 