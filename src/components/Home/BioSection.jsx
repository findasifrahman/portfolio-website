import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ScrollReveal from '../shared/ScrollReveal';

const BioSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const bioText = `Passionate Software Developer | PCB designer | Innovator | Problem Solver

I am a multidisciplinary engineer who builds real systems, not demos.

My work sits at the intersection of AI, embedded systems, RF hardware, distributed infrastructure, and production software. I design products end-to-end — from PCB and firmware, to backend architecture, to AI agents, to deployment and operations.

Over the years, I’ve delivered systems used in telecom, education, surveillance, networking, virtualization, and cross-border digital services, often under real-world constraints: limited budget, unreliable infrastructure, tight timelines, and high reliability requirements.

I’m especially strong at turning complex, messy problems into working systems..

🛠️ Innovative Projects: As the founder of Intricate Lab, I've spearheaded numerous groundbreaking projects, from designing and developing a pure sine wave inverter to creating software solutions for fingerprint attendance systems, task-based event scheduling for the Bangladesh Navy, and kiosk-based exam management systems.

📡 RF Communication Expertise: My expertise extends to RF communication, where I've led the development of a UHF communication set for tactical messaging, complete with encrypted voice communication capabilities. This involved intensive research, hardware design, and meticulous software development using STM32 microcontrollers, alongside my proficiency in RF ICs and digital signal processing.

🚀 Recent Achievements: Most recently, I've developed a comprehensive offline software solution for radio products using Raspberry Pi, leveraging Electron.js, Node.js, Angular, and offline maps for GPS functionality. This project exemplifies my ability to innovate and adapt to diverse technological landscapes.

🌟 Looking Ahead: I'm now seeking opportunities where I can continue to leverage my diverse skill set and passion for innovation. Whether it's in software development, hardware design, or RF communication, I'm eager to contribute my expertise to impactful projects and drive technological advancements.

Let's connect and explore how we can collaborate to push the boundaries of technology together!`;

  const firstFiftyWords = bioText.split(' ').slice(0, 150).join(' ') + '...';
  const shouldShowReadMore = bioText.split(' ').length > 150;

  return (
    <Box
      sx={{
        py: 8,
        background: '#000',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
      id="about"
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
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <ScrollReveal>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  gutterBottom
                  sx={{
                    color: '#90caf9',
                    fontWeight: 'bold',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    transform: 'translateZ(20px)',
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                    background: 'linear-gradient(45deg,rgb(249, 144, 223), #cc3322)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  About Me
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    mb: shouldShowReadMore ? 2 : 3,
                    textAlign: 'justify',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    transform: 'translateZ(20px)',
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                    whiteSpace: 'pre-line',
                    fontFamily: '"Playfair Display", serif'

                    
                  }}
                >
                  {isExpanded ? bioText : firstFiftyWords}
                </Typography>
                {shouldShowReadMore && (
                  <Button
                    onClick={() => setIsExpanded(!isExpanded)}
                    endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
                    sx={{
                      color: '#90caf9',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(144, 202, 249, 0.1)'
                      }
                    }}
                  >
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </Button>
                )}
              </motion.div>
            </ScrollReveal>
          </Grid>
          <Grid item xs={12} md={6}>
            <ScrollReveal>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: isMobile ? '300px' : '500px',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  >
                    <source src="/assets/img/bio/bio.mp4" type="video/mp4" />
                  </video>
                </Box>
              </motion.div>
            </ScrollReveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BioSection; 