import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { GitHub, LinkedIn, YouTube, Code, Hardware, Science } from '@mui/icons-material';
import ScrollReveal from '../shared/ScrollReveal';
import LazyImage from '../shared/LazyImage';
import ExpertiseModal from './ExpertiseModal';
import DataService from '../../services/DataService';
import TopMenu from '../shared/TopMenu';

const skillLogos = [
  { name: 'Altium', logo: '/assets/img/skills/altium.png', url: 'https://www.altium.com/', category: 'Hardware', description: 'Professional PCB Design Software' },
  { name: 'KiCad', logo: '/assets/img/skills/kicad.png', url: 'https://www.kicad.org/', category: 'Hardware', description: 'Open Source PCB Design Suite' },
  { name: 'Python', logo: '/assets/img/skills/python.png', url: 'https://www.python.org/', category: 'Programming', description: 'General Purpose Programming' },
  { name: 'STM32', logo: '/assets/img/skills/stm32.png', url: 'https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html', category: 'Hardware', description: 'ARM-based Microcontrollers' },
  { name: 'ESP32', logo: '/assets/img/skills/esp32.png', url: 'https://www.espressif.com/en/products/socs/esp32', category: 'Hardware', description: 'WiFi & Bluetooth SoC' },
  { name: 'Node.js', logo: '/assets/img/skills/nodejs.png', url: 'https://nodejs.org/', category: 'Programming', description: 'JavaScript Runtime Environment' },
  { name: 'React', logo: '/assets/img/skills/react.png', url: 'https://reactjs.org/', category: 'Programming', description: 'Frontend UI Library' },
  { name: 'Angular', logo: '/assets/img/skills/angular.png', url: 'https://angular.io/', category: 'Programming', description: 'Full-featured Frontend Framework' },
  { name: 'MongoDB', logo: '/assets/img/skills/mongodb.png', url: 'https://www.mongodb.com/', category: 'Database', description: 'NoSQL Database' },
  { name: 'PostgreSQL', logo: '/assets/img/skills/postgresql.png', url: 'https://www.postgresql.org/', category: 'Database', description: 'Advanced SQL Database' },
  { name: 'Firebase', logo: '/assets/img/skills/firebase.png', url: 'https://firebase.google.com/', category: 'Cloud', description: 'Backend-as-a-Service Platform' },
  { name: 'Azure', logo: '/assets/img/skills/azure.png', url: 'https://azure.microsoft.com/', category: 'Cloud', description: 'Microsoft Cloud Platform' },
  { name: 'AWS', logo: '/assets/img/skills/aws.png', url: 'https://aws.amazon.com/', category: 'Cloud', description: 'Amazon Web Services' },
  { name: 'Docker', logo: '/assets/img/skills/docker.png', url: 'https://www.docker.com/', category: 'DevOps', description: 'Container Platform' },
  { name: 'CI/CD', logo: '/assets/img/skills/cicd.png', url: 'https://github.com/features/actions', category: 'DevOps', description: 'Continuous Integration/Deployment' },
  { name: 'DevOps', logo: '/assets/img/skills/devops.png', url: 'https://www.atlassian.com/devops', category: 'DevOps', description: 'Development Operations' }
];

const categories = ['All', 'Hardware', 'Programming', 'Database', 'Cloud', 'DevOps'];

const HeroSection = () => {
  const [selectedExpertise, setSelectedExpertise] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchCertifications = async () => {
      const data = await DataService.getCertifications();
      setCertifications(data);
    };
    fetchCertifications();
  }, []);

  const socialLinks = [
    { icon: <GitHub />, url: 'https://github.com/findasifrahman', label: 'GitHub' },
    { icon: <LinkedIn />, url: 'https://bd.linkedin.com/in/AsifRahman18', label: 'LinkedIn' },
    { icon: <YouTube />, url: 'https://www.youtube.com/channel/UCztj8CCuOJ0xuyIL5wzmbsw', label: 'YouTube' }
  ];

  const expertiseAreas = [
    {
      icon: <Code />,
      title: 'Software Development',
      description: 'Full-stack development with modern technologies',
      projects: [
        {
          title: 'GPS Tracker',
          image: '/assets/img/projects/autosol.jpg',
          redirectUrl: 'https://www.intricatlab.com/',
          skills: 'Android · Amazon EC2 · Objective-C · Angular · Node.js · RabbitMQ · React Native'
        },
        {
          title: 'UHF Radio Messaging System',
          image: '/assets/img/products/uhf_radio_main.png',
          redirectUrl: 'https://www.linkedin.com/posts/asifrahman10018_bijoy-50-tactical-messaging-system-radio-activity-7178334044256972801-5Gb3?utm_source=share&utm_medium=member_desktop&rcm=ACoAAB6eMAMBE5aHfHbmB3UlObJsBeRC28YI9M0',
          skills: 'Keil uVision · Printed Circuit Board (PCB) Design · Wireless Mesh · Raspberry Pi · Radio Frequency (RF) · Angular · STM32 · Node.js'
        },
        {
          title: 'SAAS ERP for Food Supply Industry',
          image: '/assets/img/products/saasERP.png',
          redirectUrl: 'https://proud-ocean-0ed2e3100.5.azurestaticapps.net',
          skills: 'Python · Angular · Microsoft Azure · Azure Functions · Flask · SQL · postgres · CI/CD'
        }
      ]
    },
    {
      icon: <Hardware />,
      title: 'Hardware Design',
      description: 'PCB design and embedded systems development',
      projects: [
        {
          title: 'Advanced PCB Design',
          image: '/assets/img/products/advanced_pcb_zynq.png',
          redirectUrl: 'https://www.linkedin.com/posts/asifrahman10018_hardwaredesign-pcbdesign-zynq-activity-7297698405672263681-Q0Nt?utm_source=share&utm_medium=member_desktop&rcm=ACoAAB6eMAMBE5aHfHbmB3UlObJsBeRC28YI9M0',
          skills: 'Advanced Digital Hardware Design · Field-Programmable Gate Arrays (FPGA) · zynq · Xilinx Vivado'
        },
        {
          title: 'IOT Device Wemey',
          image: '/assets/img/products/wemey-1.png',
          redirectUrl: '#',
          skills: 'ESP32 Microcontrollers · Node-RED · Embedded Systems'
        },
        {
          title: 'Custom Product Design',
          image: '/assets/img/products/customProduct.jpg',
          redirectUrl: '#',
          skills: 'PCB Design · Embedded Systems · Hardware Development'
        }
      ]
    },
    {
      icon: <Science />,
      title: 'AI/ML',
      description: 'Machine learning and artificial intelligence applications',
      projects: [
        {
          title: 'AI Agent',
          image: '/assets/img/products/AI-scrap-agent.png',
          redirectUrl: 'https://github.com/findasifrahman/llm-scraper',
          skills: 'Multi-agent Systems · Machine Learning · Artificial Intelligence (AI) · Web Scraping · RAG, Langchain',
          details: 'A sophisticated web scraping system leveraging CrewAI and multiple AI agents working in collaboration. Features include:\n• Intelligent content extraction using OpenAI\n• Multi-agent orchestration for complex tasks\n• RAG implementation for context-aware scraping\n• Performance monitoring and optimization\n• Automated data processing pipeline'
        },
        {
          title: 'Langchain RAG Firestore Chat',
          image: '/assets/img/products/langchaint-rag.png',
          redirectUrl: 'https://github.com/findasifrahman/langchain',
          skills: 'LangChain · RAG, Langchain · Large Language Models (LLM) · Artificial Intelligence (AI) · Firebase · Cloud Firestore',
          details: 'A real-time conversation system that uses RAG and Langchain to interact with electronics IC datasheets. Chat history is saved in Firebase Firestore for persistence.'
        },
        {
          title: 'LLM Scraper',
          image: '/assets/img/products/llm-scraper.png',
          redirectUrl: 'https://github.com/findasifrahman/llm-scraper',
          skills: 'Large Language Models (LLM) · RAG, Langchain · Web Scraping · Python · Agent-based Modeling',
          details: 'A demonstration of implementing a web scraping agent using Firecrawl and OpenAI. Uses Langchain to monitor agent performance and provide score-based feedback.'
        }
      ]
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#000',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
      id="home"
    >
      <TopMenu />
      
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          opacity: 0.1,
          pointerEvents: 'none'
        }}
      />
      
      {/* Hero Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  fontWeight: 'bold',
                  mb: 2,
                  background: 'linear-gradient(45deg, #90caf9, #64b5f6)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontFamily: '"Playfair Display", serif',
                  lineHeight: 1.2
                }}
              >
                MD ASIFUR RAHMAN
              </Typography>


              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => scrollToSection('projects')}
                  sx={{
                    backgroundColor: '#90caf9',
                    color: '#000',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#64b5f6',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  View Projects
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => scrollToSection('about')}
                  sx={{
                    borderColor: '#90caf9',
                    color: '#90caf9',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: '#64b5f6',
                      backgroundColor: 'rgba(144, 202, 249, 0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  About Me
                </Button>
              </Box>
            </motion.div>

            <Grid container spacing={4} alignItems="center" sx={{ mt: 8 }}>
              <Grid item xs={12} md={6}>
                <ScrollReveal>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Typography
                      variant="h2"
                      component="h2"
                      gutterBottom
                      sx={{
                        fontSize: { xs: '1.5rem', md: '2.5rem' },
                        fontWeight: 'bold',
                        mb: 2,
                        color: '#fff',
                        lineHeight: 1.2,
                        background: 'linear-gradient(45deg,rgb(249, 144, 223), #cc3322)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      Entrepreneur | Software | PCB | AI/ML | Embedded
                    </Typography>
                    <Typography
                      variant="h4"
                      component="h2"
                      gutterBottom
                      sx={{ 
                        mb: 2, 
                        background: 'linear-gradient(45deg, #90caf9, #64b5f6, #42a5f5)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                        position: 'relative',
                        display: 'inline-block',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: '-4px',
                          left: 0,
                          width: '100%',
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, #90caf9, transparent)'
                        }
                      }}
                    >
                      Tech Stack
                    </Typography>
                    
                    {/* Category Filter */}
                    <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {categories.map((category) => (
                        <Button
                          key={category}
                          size="small"
                          onClick={() => setSelectedCategory(category)}
                          sx={{
                            color: selectedCategory === category ? '#90caf9' : 'rgba(255,255,255,0.7)',
                            borderColor: selectedCategory === category ? '#90caf9' : 'rgba(255,255,255,0.2)',
                            '&:hover': {
                              borderColor: '#90caf9',
                              backgroundColor: 'rgba(144, 202, 249, 0.1)'
                            }
                          }}
                        >
                          {category}
                        </Button>
                      ))}
                    </Box>

                    <Grid 
                      container 
                      spacing={3} 
                      sx={{ 
                        mb: 4,
                        maxWidth: '800px'
                      }}
                    >
                      {skillLogos
                        .filter(skill => selectedCategory === 'All' || skill.category === selectedCategory)
                        .map((skill, index) => (
                        <Grid item xs={3} sm={2} md={1.5} key={index}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              delay: index * 0.05,
                              duration: 0.3
                            }}
                            whileHover={{ 
                              scale: 1.1,
                              rotate: 5
                            }}
                          >
                            <Tooltip 
                              title={
                                <Box sx={{ p: 1 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                    {skill.name}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#90caf9', mb: 0.5 }}>
                                    {skill.description}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {skill.category}
                                  </Typography>
                                </Box>
                              } 
                              arrow
                              placement="top"
                            >
                              <Box
                                component="a"
                                href={skill.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  p: 2,
                                  borderRadius: 2,
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  transition: 'all 0.3s',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(45deg, rgba(144, 202, 249, 0.1), rgba(144, 202, 249, 0))',
                                    opacity: 0,
                                    transition: 'opacity 0.3s'
                                  },
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    transform: 'translateY(-2px)',
                                    '&::before': {
                                      opacity: 1
                                    }
                                  }
                                }}
                              >
                                <img
                                  src={skill.logo}
                                  alt={skill.name}
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    objectFit: 'contain',
                                    filter: 'brightness(1.2)'
                                  }}
                                />
                              </Box>
                            </Tooltip>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                      {socialLinks.map((link, index) => (
                        <motion.a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          style={{ color: 'white', textDecoration: 'none' }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              transition: 'all 0.3s',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            {link.icon}
                            <Typography variant="body2">{link.label}</Typography>
                          </Box>
                        </motion.a>
                      ))}
                    </Box>
                  </motion.div>
                </ScrollReveal>
              </Grid>
              <Grid item xs={12} md={6}>
                <ScrollReveal delay={0.3}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: { xs: '300px', md: '400px' },
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: '#90caf9',
                          borderRadius: '20px',
                          transform: 'rotate(3deg)',
                          zIndex: 1
                        }}
                      />
                      <LazyImage
                        src="/assets/img/profile.jpg"
                        alt="Md. Asifur Rahman"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '20px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                          position: 'relative',
                          zIndex: 2
                        }}
                      />
                    </motion.div>
                  </Box>
                </ScrollReveal>
              </Grid>
            </Grid>

            {/* Stats Section */}
            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: '#90caf9', fontWeight: 'bold' }}>+10</Typography>
                <Typography variant="h6" sx={{ color: '#fff', fontFamily: '"Playfair Display", serif' }}>YEARS OF EXPERIENCE</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: '#90caf9', fontWeight: 'bold' }}>+50</Typography>
                <Typography variant="h6" sx={{ color: '#fff', fontFamily: '"Playfair Display", serif' }}>PROJECTS COMPLETED</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: '#90caf9', fontWeight: 'bold' }}>+50</Typography>
                <Typography variant="h6" sx={{ color: '#fff', fontFamily: '"Playfair Display", serif' }}>WORLDWIDE CLIENTS</Typography>
              </Box>
            </Box>

            {/* Expertise Areas */}
            <Box sx={{ mt: 8 }}>
              <Grid container spacing={3}>
                {expertiseAreas.map((area, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      <Paper
                        onClick={() => setSelectedExpertise(area)}
                        sx={{
                          p: 3,
                          height: '100%',
                          minHeight: '200px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: 2,
                          transition: 'all 0.3s',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            background: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              mr: 2,
                              color: '#90caf9'
                            }}
                          >
                            {area.icon}
                          </Box>
                          <Typography variant="h6" sx={{ color: '#fff' }}>{area.title}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#90caf9' }}>
                          {area.description}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Expertise Modal */}
      <ExpertiseModal
        open={!!selectedExpertise}
        onClose={() => setSelectedExpertise(null)}
        title={selectedExpertise?.title}
        projects={selectedExpertise?.projects || []}
      />
    </Box>
  );
};

export default HeroSection; 