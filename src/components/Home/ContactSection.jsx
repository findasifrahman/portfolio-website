import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Link,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ScrollReveal from '../shared/ScrollReveal';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    // For now, we'll just show a success message
    setSnackbar({
      open: true,
      message: 'Message sent successfully!',
      severity: 'success'
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        py: 8,
        background: '#000',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
      id="contact"
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          opacity: 0.1,
          zIndex: 0
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <ScrollReveal>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 6,
              color: '#fff',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg,rgb(249, 144, 223), #cc3322)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Get In Touch
          </Typography>
        </ScrollReveal>

        <Grid container spacing={4}>
          {/* Left Column - Contact Info */}
          <Grid item xs={12} md={4}>
            <ScrollReveal>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: '#90caf9', mb: 4 }}>
                  Let's Connect
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                    I'm available for freelance or full-time positions. Contact me and let's talk.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Link
                      href="https://www.linkedin.com/in/asifrahman10018"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: '#90caf9',
                        textDecoration: 'none',
                        '&:hover': { color: '#64b5f6' }
                      }}
                    >
                      <LinkedInIcon /> LinkedIn
                    </Link>
                    
                    <Link
                      href="https://github.com/findasifrahman"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: '#90caf9',
                        textDecoration: 'none',
                        '&:hover': { color: '#64b5f6' }
                      }}
                    >
                      <GitHubIcon /> GitHub
                    </Link>
                    
                    <Link
                      href="mailto:findasifrahman@gmail.com"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: '#90caf9',
                        textDecoration: 'none',
                        '&:hover': { color: '#64b5f6' }
                      }}
                    >
                      <EmailIcon /> findasifrahman@gmail.com
                    </Link>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ color: '#90caf9', mb: 2 }}>
                    Location
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <LocationIcon sx={{ color: '#90caf9', mt: 0.5 }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Dhaka, Bangladesh
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <LocationIcon sx={{ color: '#90caf9', mt: 0.5 }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Tianhe District, Guangzhou, Guangdong, China
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </ScrollReveal>
          </Grid>

          {/* Right Column - Contact Form */}
          <Grid item xs={12} md={8}>
            <ScrollReveal>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: '#90caf9', mb: 4 }}>
                  Contact Me
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#90caf9',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#90caf9',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-focused': {
                              color: '#90caf9',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#90caf9',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#90caf9',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-focused': {
                              color: '#90caf9',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#90caf9',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#90caf9',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-focused': {
                              color: '#90caf9',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#90caf9',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#90caf9',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-focused': {
                              color: '#90caf9',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{
                          background: '#90caf9',
                          color: '#000',
                          '&:hover': {
                            background: '#64b5f6',
                          },
                        }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </ScrollReveal>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ContactSection; 