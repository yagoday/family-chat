import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Popper,
  ClickAwayListener,
  useMediaQuery,
  useTheme,
  Modal,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface InputAreaProps {
  onSendMessage: (content: string) => void;
  onTyping: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    onTyping();
  };

  return (
    <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="הקלד הודעה..."
          sx={{
            backgroundColor: 'white',
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <IconButton
          ref={emojiButtonRef}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          sx={{ color: '#4a90e2' }}
        >
          <EmojiEmotionsIcon />
        </IconButton>
        <IconButton
          onClick={handleSend}
          disabled={!message.trim()}
          sx={{
            backgroundColor: message.trim() ? '#4a90e2' : 'transparent',
            color: message.trim() ? 'white' : '#bdbdbd',
            '&:hover': {
              backgroundColor: message.trim() ? '#357abd' : 'transparent',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>

      {isMobile ? (
        <Modal
          open={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'background.paper',
              borderRadius: '16px 16px 0 0',
            }}
          >
            <Box sx={{ 
              height: '50vh',
              '& .emoji-mart': {
                width: '100% !important',
                height: '100% !important'
              }
            }}>
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="light"
              />
            </Box>
          </Paper>
        </Modal>
      ) : (
        <Popper
          open={showEmojiPicker}
          anchorEl={emojiButtonRef.current}
          placement="top-end"
          style={{ zIndex: 1000 }}
        >
          <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
            <Paper elevation={3}>
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="light"
              />
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
    </Box>
  );
};

export default InputArea; 