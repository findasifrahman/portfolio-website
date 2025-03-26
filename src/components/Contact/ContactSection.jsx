import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  IconButton
} from '@mui/material';
import {
  Email,
  LinkedIn,
  GitHub,
  YouTube
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  const socialLinks = [
    { icon: <Email />, url: 'mailto:asifur.93@gmail.com', label: 'Email' },
    { icon: <LinkedIn />, url: 'https://bd.linkedin.com/in/AsifRahman18', label: 'LinkedIn' },
    { icon: <GitHub />, url: 'https://github.com/findasifrahman', label: 'GitHub' },
    { icon: <YouTube />, url: 'https://www.youtube.com/channel/UCztj8CCuOJ0xuyIL5wzmbsw', label: 'YouTube' }
  ];

  const budgetOptions = [
    { value: '<$3k', label: 'Less than $3,000' },
    { value: '$3k-$5k', label: '$3,000 - $5,000' },
    { value: '$5k-$10k', label: '$5,000 - $10,000' },
    { value: '>$10k', label: 'More than $10,000' }
  ];

  return (
    <Box
      sx={{
        py: 8,
        background: '#000',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
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
        <Typography 
          variant="h2" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{
            mb: 6,
            color: '#fff',
            fontWeight: 'bold'
          }}
        >
          Let's Work Together
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
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
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
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
              <TextField
                fullWidth
                select
                label="Budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
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
                  '& .MuiMenuItem-root': {
                    color: '#000',
                  },
                }}
              >
                {budgetOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
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
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#90caf9',
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#64b5f6',
                  },
                }}
              >
                Submit
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ pl: { md: 4 } }}>
              <Typography variant="h4" gutterBottom sx={{ color: '#90caf9', fontWeight: 'bold' }}>
                Connect With Me
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: '#fff', mb: 4 }}>
                Feel free to reach out for collaborations, questions, or just to say hello! I'm always open to discussing new projects and opportunities.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {socialLinks.map((link, index) => (
                  <motion.div
                    key={link.label}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      component="a"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: '#90caf9',
                        backgroundColor: 'rgba(144, 202, 249, 0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(144, 202, 249, 0.2)',
                        },
                      }}
                    >
                      {link.icon}
                    </IconButton>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactSection; 