import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { io, Socket } from 'socket.io-client';
import Header from './Header';
import MessageList from './MessageList';
import InputArea from './InputArea';
import BackgroundSlider from '../BackgroundSlider';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
    nickname: string;
    avatar: string;
  };
  timestamp: string;
  imageUrl?: string;
}

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000';
const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Parse user data and provide default values
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {
    id: '',
    username: '',
    nickname: '',
    avatar: '/images/default-avatar.jpg',
    isAdmin: false
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/messages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('new_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleSendMessage = (content: string) => {
    if (socket) {
      socket.emit('send_message', { content });
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <BackgroundSlider />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.05)'
      }}>
        <Header 
          displayName={user?.nickname || user?.username || ''} 
          isOnline={isConnected}
          avatar={user?.avatar || '/images/default-avatar.jpg'}
        />
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <MessageList messages={messages} currentUserId={user?.id || ''} />
        </Box>
        <InputArea onSendMessage={handleSendMessage} onTyping={handleTyping} />
      </Box>
    </Box>
  );
};

export default Chat; 