import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';

interface MessageItemProps {
  content: string;
  sender: string;
  senderAvatar: string;
  timestamp: string;
  isCurrentUser: boolean;
  imageUrl?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  content,
  sender,
  senderAvatar,
  timestamp,
  isCurrentUser,
  imageUrl,
}) => {
  const [isAvatarEnlarged, setIsAvatarEnlarged] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setIsAvatarEnlarged(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseLeave = () => {
    setIsAvatarEnlarged(false);
  };

  const handleAvatarClick = () => {
    setIsAvatarEnlarged(!isAvatarEnlarged);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCurrentUser ? 'flex-start' : 'flex-end',
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isCurrentUser ? 'row' : 'row-reverse',
          alignItems: 'flex-end',
          gap: 1,
          maxWidth: '70%',
        }}
      >
        <Box
          ref={avatarRef}
          sx={{
            position: 'relative',
            width: 32,
            height: 32,
            mb: 1
          }}
        >
          <Avatar
            src={senderAvatar}
            alt={sender}
            onClick={handleAvatarClick}
            sx={{
              width: isAvatarEnlarged ? 120 : 32,
              height: isAvatarEnlarged ? 120 : 32,
              transition: 'all 0.4s ease-in-out',
              cursor: 'pointer',
              position: 'absolute',
              transform: isAvatarEnlarged ? 'scale(1)' : 'scale(1)',
              boxShadow: isAvatarEnlarged ? '0 4px 20px rgba(0,0,0,0.2)' : 'none',
              zIndex: isAvatarEnlarged ? 1000 : 1,
              '@media (hover: hover)': {
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="caption"
            sx={{
              mb: 0.5,
              color: '#666',
              alignSelf: isCurrentUser ? 'flex-start' : 'flex-end',
            }}
          >
            {sender}
          </Typography>
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              backgroundColor: isCurrentUser ? '#4a90e2' : '#f5f5f5',
              color: isCurrentUser ? 'white' : 'inherit',
              borderRadius: 2,
              wordBreak: 'break-word',
            }}
          >
            {imageUrl && (
              <Box
                component="img"
                src={imageUrl}
                alt="Message attachment"
                sx={{
                  maxWidth: '100%',
                  borderRadius: 1,
                  mb: content ? 1 : 0,
                }}
              />
            )}
            <Typography variant="body1">{content}</Typography>
          </Paper>
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              color: '#666',
              alignSelf: isCurrentUser ? 'flex-start' : 'flex-end',
            }}
          >
            {new Date(timestamp).toLocaleTimeString('he-IL', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageItem; 