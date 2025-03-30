import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import axios from 'axios';
import {
  initializeDatabase,
  processAndStoreData,
  findSimilarChunks,
} from '../../utils/embeddings';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const { data } = useData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChatbot = async () => {
      try {
        console.log('Initializing chatbot...');
        console.log('Received data:', Object.keys(data));
        
        // Log sample of data for debugging
        Object.entries(data).forEach(([key, value]) => {
          console.log(`${key}:`, typeof value === 'string' ? value.substring(0, 100) + '...' : value);
        });

        if (!data || Object.keys(data).length === 0) {
          console.error('No data available in context');
          setError('No data available. Please refresh the page.');
          return;
        }

        const db = await initializeDatabase();
        console.log('Database initialized successfully');

        const success = await processAndStoreData(db, data);
        if (!success) {
          console.error('Failed to process and store data');
          setError('Failed to process data. Please try refreshing the page.');
          return;
        }

        setIsInitialized(true);
        setError(null);
        console.log('Chatbot initialized successfully');
      } catch (error) {
        console.error('Error initializing chatbot:', error);
        setError('Failed to initialize the chatbot. Please try refreshing the page.');
      }
    };

    initializeChatbot();
  }, [data]);

  const handleSend = async () => {
    if (!input.trim() || !isInitialized) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setIsLoading(true);

    try {
      const db = await initializeDatabase();
      const similarChunks = await findSimilarChunks(db, userMessage);
      
      console.log('Found similar chunks:', similarChunks.length);
      similarChunks.forEach((chunk, index) => {
        console.log(`Chunk ${index + 1}:`, chunk.text.substring(0, 100) + '...');
        console.log(`Source: ${chunk.source}, Score: ${chunk.score.toFixed(3)}`);
      });

      // Create a more detailed system prompt that handles both RAG and general knowledge
      const systemMessage = {
        role: "system",
        content: `You are an intelligent assistant for my portfolio. Your goal is to provide comprehensive, well-structured answers while maintaining a professional tone. Always refer to yourself as "I" and to the portfolio owner as "I" or "me".

Guidelines:
1. If specific information is provided in the context:
   - Use that as your primary source
   - Cite the source when possible
   - Provide specific details from the context
   - Include project links if available
2. If the context doesn't contain specific information:
   - Acknowledge that you don't have specific information from the portfolio
   - Provide relevant general information about my expertise
   - Use your general knowledge about software development and technology
   - Be transparent about what's from the portfolio vs. general knowledge
3. Structure your responses with:
   - A clear, direct answer to the question
   - Supporting details from the context (if available)
   - Additional relevant information from general knowledge
4. Maintain a professional and engaging tone
5. If information seems outdated or incomplete, mention that
6. Be concise but thorough
7. If you find multiple relevant pieces of information, combine them logically
8. When discussing skills or expertise:
   - List all relevant skills found in the context
   - Add relevant general skills that would be expected for the role
   - Group related skills together
   - Mention any specific technologies or tools
   - Include any certifications or achievements
9. Always provide my email address (findasifrahman@gmail.com) for further queries

${similarChunks.length > 0 ? `Context from portfolio:\n\n${similarChunks.map(chunk => `[${chunk.source}]: ${chunk.text}`).join('\n\n')}` : 'No specific information found in the portfolio.'}`
      };

      // Add user's question with context about the hybrid approach
      const userMessageObj = {
        role: "user",
        content: `Question: ${userMessage}\n\nPlease provide a comprehensive answer. If you don't have specific information from the portfolio, provide relevant general information about my expertise in software development and technology.`
      };

      // Get response from OpenRouter API with adjusted parameters
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'mistralai/mistral-7b-instruct',
        messages: [systemMessage, userMessageObj],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        stop: ["\n\n\n"]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      const assistantMessage = response.data.choices[0].message.content;
      setMessages(prev => [...prev, { text: assistantMessage, sender: 'bot' }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, {
        text: "I apologize, but I encountered an error. Please try asking your question again. If the issue persists, you can try asking about my general background, skills, or projects. For further assistance, please email me at asifurrahman@gmail.com",
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
        width: isOpen ? { xs: '100%', sm: 400 } : 'auto',
      }}
    >
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Paper
              elevation={3}
              sx={{
                height: { xs: '100vh', sm: 500 },
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(45deg,rgb(13, 13, 14), #21CBF3)',
                  color: 'white',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontFamily: '"Playfair Display", serif'
                  }}
                >
                  Chat with Me
                </Typography>
                <IconButton onClick={() => setIsOpen(false)} size="small" sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  background: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {error ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="error">{error}</Typography>
                  </Box>
                ) : !isInitialized ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  messages.map((message, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          maxWidth: '80%',
                          background: message.sender === 'user' 
                            ? 'linear-gradient(45deg, #2196f3, #21CBF3)'
                            : 'rgba(15, 14, 14, 0.9)',
                          borderRadius: '12px',
                          borderTopLeftRadius: message.sender === 'user' ? '12px' : '4px',
                          borderTopRightRadius: message.sender === 'user' ? '4px' : '12px',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <Typography
                          sx={{
                            color: message.sender === 'user' ? 'white' : 'text.primary',
                            whiteSpace: 'pre-wrap',
                            fontFamily: '"Playfair Display", serif',
                            lineHeight: 1.6,
                            fontSize: '0.95rem',
                          }}
                        >
                          {message.text}
                        </Typography>
                      </Paper>
                    </Box>
                  ))
                )}
                {isLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        background: 'rgba(3, 3, 3, 0.9)',
                        borderRadius: '12px',
                        borderTopRightRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <CircularProgress size={20} />
                    </Paper>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  gap: 1,
                  background: 'rgba(255, 255, 255, 0.95)',
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isInitialized ? "Ask me anything about my portfolio..." : "Initializing chat..."}
                  variant="outlined"
                  size="small"
                  disabled={!isInitialized}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(0, 0, 0, 0.9)',
                      borderRadius: '8px',
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.95)',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.2)',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontFamily: '"Playfair Display", serif',
                    },
                  }}
                />
              </Box>
            </Paper>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <IconButton
              onClick={() => setIsOpen(true)}
              sx={{
                background: 'linear-gradient(45deg, #2196f3, #21CBF3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976d2, #1a9bcb)',
                },
              }}
            >
              <ChatIcon />
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Chatbot; 