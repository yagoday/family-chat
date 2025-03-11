import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import MessageItem from './MessageItem';

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

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages = [], currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const messageArray = Array.isArray(messages) ? messages : [];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {messageArray.map((message) => (
        <MessageItem
          key={message.id}
          content={message.content}
          sender={message.sender.nickname}
          senderAvatar={`/images/${message.sender.username}.jpeg`}
          timestamp={message.timestamp}
          isCurrentUser={message.sender.id === currentUserId}
          imageUrl={message.imageUrl}
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList; 