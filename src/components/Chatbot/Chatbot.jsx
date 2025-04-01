import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import MaximizeIcon from '@mui/icons-material/CropSquare';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import axios from 'axios';
import {
  initializeDatabase,
  processAndStoreData,
  findSimilarChunks,
} from '../../utils/embeddings';

const Chatbot = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const { data } = useData();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isMinimized) {
        setIsMinimized(false);
      }
    }
  };

  const renderDesktopChatbot = () => (
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
                height: isMinimized ? 60 : { xs: '100vh', sm: 500 },
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: isMinimized ? 'pointer' : 'default',
              }}
              onClick={() => isMinimized && setIsMinimized(false)}
              onKeyPress={handleKeyPress}
              role="button"
              tabIndex={isMinimized ? 0 : -1}
              aria-label={isMinimized ? "Click to maximize chat window" : "Chat window"}
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
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMinimized(!isMinimized);
                    }}
                    size="small" 
                    sx={{ color: 'white' }}
                  >
                    {isMinimized ? <MaximizeIcon /> : <MinimizeIcon />}
                  </IconButton>
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }} 
                    size="small" 
                    sx={{ color: 'white' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>

              {!isMinimized && (
                <>
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder={isInitialized ? "Ask me anything about my portfolio..." : "Initializing chat..."}
                      variant="outlined"
                      size="small"
                      disabled={!isInitialized}
                      inputRef={textareaRef}
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
                    <IconButton 
                      onClick={handleSend} 
                      disabled={isLoading || !isInitialized}
                      sx={{
                        background: 'linear-gradient(45deg, #2196f3, #21CBF3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976d2, #1a9bcb)',
                        },
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </>
              )}
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

  const renderMobileChatbot = () => (
    <div className="chatbot-container">
      <div 
        className={`chatbot-box ${isOpen ? 'open' : ''} ${isMinimized ? 'minimized' : ''}`}
        onClick={() => isMinimized && setIsMinimized(false)}
        onKeyPress={handleKeyPress}
        role="button"
        tabIndex={isMinimized ? 0 : -1}
        aria-label={isMinimized ? "Click to maximize chat window" : "Chat window"}
      >
        <div className="chatbot-header">
          <h3>Chat with Me</h3>
          <div className="chatbot-controls">
            <IconButton 
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              size="small"
              sx={{ color: 'white' }}
            >
              {isMinimized ? <MaximizeIcon /> : <MinimizeIcon />}
            </IconButton>
            <IconButton 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              size="small"
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        {!isMinimized && (
          <>
            <div className="chatbot-messages" ref={messagesEndRef}>
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  <div className="message-content">
                    <div className="message-text">{message.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="chatbot-input">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything about MD Asifur Rahman..."
                rows="1"
                ref={textareaRef}
              />
              <button onClick={handleSend} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        )}
      </div>
      <IconButton
        onClick={() => setIsOpen(true)}
        sx={{
          display: isOpen ? 'none' : 'block',
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: 'linear-gradient(45deg, #2196f3, #21CBF3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1976d2, #1a9bcb)',
          },
        }}
      >
        <ChatIcon />
      </IconButton>
    </div>
  );

  return isMobile ? renderMobileChatbot() : renderDesktopChatbot();
};

export default Chatbot;

const styles = `
  .chatbot-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }

  .chatbot-box {
    width: 400px;
    height: 600px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s ease;
    position: relative;
    cursor: pointer;
  }

  .chatbot-box.minimized {
    height: 60px;
  }

  .chatbot-box.minimized .chatbot-messages,
  .chatbot-box.minimized .chatbot-input {
    display: none;
  }

  .chatbot-header {
    padding: 15px;
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
  }

  .chatbot-header h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
  }

  .chatbot-controls {
    display: flex;
    gap: 10px;
  }

  .chatbot-controls button {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px;
    color: #666;
    transition: color 0.2s;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .chatbot-controls button:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
  }

  .chatbot-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .message {
    max-width: 80%;
    padding: 10px 15px;
    border-radius: 15px;
    line-height: 1.4;
    word-wrap: break-word;
  }

  .message.user {
    align-self: flex-end;
    background: #007bff;
    color: white;
    border-bottom-right-radius: 5px;
  }

  .message.assistant {
    align-self: flex-start;
    background: #f1f1f1;
    color: #333;
    border-bottom-left-radius: 5px;
  }

  .chatbot-input {
    padding: 15px;
    border-top: 1px solid #dee2e6;
    display: flex;
    gap: 10px;
    background: white;
  }

  .chatbot-input textarea {
    flex: 1;
    padding: 10px;
    border: 1px solid #dee2e6;
    border-radius: 5px;
    resize: none;
    font-family: inherit;
    font-size: 0.9rem;
    line-height: 1.4;
    max-height: 100px;
    overflow-y: auto;
  }

  .chatbot-input button {
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .chatbot-input button:hover {
    background: #0056b3;
  }

  .chatbot-input button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .chatbot-toggle {
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .chatbot-toggle:hover {
    background: #0056b3;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .chatbot-container {
      position: fixed;
      bottom: 0;
      right: 0;
      width: 100%;
      z-index: 9999;
    }

    .chatbot-box {
      width: 100%;
      height: calc(100vh - 60px);
      background: white;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s ease;
      position: fixed;
      bottom: 0;
      right: 0;
      border-radius: 0;
      transform: translateY(100%);
      opacity: 0;
      visibility: hidden;
      margin-top: 60px;
    }

    .chatbot-box.open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    .chatbot-box.minimized {
      height: 60px;
      margin-top: 60px;
    }

    .chatbot-box.minimized .chatbot-messages,
    .chatbot-box.minimized .chatbot-input {
      display: none;
    }

    .chatbot-header {
      padding: 15px;
      background: linear-gradient(45deg,rgb(13, 13, 14), #21CBF3);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 10000;
    }

    .chatbot-controls {
      display: flex;
      gap: 10px;
      z-index: 10001;
    }

    .chatbot-controls .MuiIconButton-root {
      color: white;
      padding: 8px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      transition: all 0.2s;
      z-index: 10002;
    }

    .chatbot-controls .MuiIconButton-root:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      background: rgba(255, 255, 255, 0.9);
      margin-top: 0;
    }

    .message {
      max-width: 90%;
      padding: 12px 16px;
      border-radius: 15px;
      line-height: 1.4;
      word-wrap: break-word;
      font-family: "Playfair Display", serif;
      font-size: 0.95rem;
    }

    .message.user {
      align-self: flex-end;
      background: linear-gradient(45deg, #2196f3, #21CBF3);
      color: white;
      border-bottom-right-radius: 5px;
    }

    .message.bot {
      align-self: flex-start;
      background: rgba(15, 14, 14, 0.9);
      color: white;
      border-bottom-left-radius: 5px;
    }

    .chatbot-input {
      padding: 15px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      gap: 10px;
      background: rgba(255, 255, 255, 0.95);
    }

    .chatbot-input textarea {
      flex: 1;
      padding: 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      resize: none;
      font-family: "Playfair Display", serif;
      font-size: 16px;
      line-height: 1.4;
      max-height: 100px;
      overflow-y: auto;
      background: rgba(0, 0, 0, 0.9);
      color: white;
    }

    .chatbot-input textarea::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .chatbot-input button {
      padding: 12px 24px;
      background: linear-gradient(45deg, #2196f3, #21CBF3);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-family: "Playfair Display", serif;
      font-weight: bold;
      transition: all 0.2s;
    }

    .chatbot-input button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .chatbot-input button:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .chatbot-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 24px;
      background: linear-gradient(45deg, #2196f3, #21CBF3);
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 9999;
      font-family: "Playfair Display", serif;
      font-weight: bold;
    }

    .chatbot-toggle::before {
      content: "💬";
      font-size: 1.2rem;
    }

    .chatbot-toggle:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }
  }
`;

// Add this line at the end of the file, before the export
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet); 