import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Memory,
  Code,
  Storage,
  Microwave,
  Architecture,
  Settings,
  Build,
  Cloud,
  DataObject,
  Psychology,
  SmartToy,
  Hub,
  Layers,
  Terminal,
  Language,
  DataArray
} from '@mui/icons-material';

const SkillCard = ({ icon: Icon, title }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        borderRadius: 2,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.1)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Box
        sx={{
          p: 1,
          borderRadius: 1,
          backgroundColor: 'rgba(144, 202, 249, 0.2)',
          color: '#90caf9'
        }}
      >
        <Icon />
      </Box>
      <Typography variant="body1" sx={{ color: '#fff' }}>
        {title}
      </Typography>
    </Box>
  </motion.div>
);

const skillCategories = {
  'Advanced Hardware Design': [
    { icon: Memory, title: 'FPGA Development' },
    { icon: Microwave, title: 'RF Design' },
    { icon: Architecture, title: 'PCB Design' },
    { icon: Settings, title: 'Embedded Systems' },
    { icon: Build, title: 'Hardware Prototyping' },
    { icon: Hub, title: 'Digital Circuit Design' }
  ],
  'Software Development': [
    { icon: Code, title: 'Full Stack Development' },
    { icon: Cloud, title: 'Cloud Computing' },
    { icon: DataObject, title: 'RESTful APIs' },
    { icon: Terminal, title: 'DevOps' },
    { icon: Language, title: 'Multiple Programming Languages' },
    { icon: DataArray, title: 'Database Management' },
    { icon: Layers, title: 'System Architecture' }
  ],
  'AI/ML Skills': [
    { icon: Psychology, title: 'Machine Learning' },
    { icon: SmartToy, title: 'Large Language Models' },
    { icon: Storage, title: 'RAG Implementation' },
    { icon: Hub, title: 'Multi-agent Systems' }
  ]
};

const SkillsSection = () => {
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
            fontWeight: 'bold',
            background: 'linear-gradient(45deg,rgb(249, 144, 223), #cc3322)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Skills & Expertise
        </Typography>

        <Grid container spacing={4}>
          {Object.entries(skillCategories).map(([category, skills], categoryIndex) => (
            <Grid item xs={12} key={category}>
              <Typography
                variant="h4"
                component="h3"
                gutterBottom
                sx={{
                  color: '#90caf9',
                  fontWeight: 'bold',
                  mb: 3
                }}
              >
                {category}
              </Typography>
              <Grid container spacing={2}>
                {skills.map((skill, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <SkillCard {...skill} />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SkillsSection; 