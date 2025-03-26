import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import { School as SchoolIcon, Link as LinkIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ScrollReveal from '../shared/ScrollReveal';
import { useData } from '../../context/DataContext';

// Define categories
const categories = [
  { label: 'Hardware Design', value: 'hardware' },
  { label: 'Software Design', value: 'software' },
  { label: 'AI/ML Design', value: 'ai' }
];

const categorizedCertifications = {
  hardware: [
    "Advanced Digital Hardware Design",
    "Tactical Messaging System Work completion certificate",
    "Certificate of Completion for knowledge bay software and hardware alongside Training for Bangladesh navy",
    "Advanced PCB Design",
    "Field-Programmable Gate Arrays (FPGA)",
    "zynq",
    "Xilinx Vivado",
    "petalinux",
    "Printed Circuit Board (PCB) Design",
    "Embedded Systems",
    "ESP32 Microcontrollers"
  ],
  software: [
    "Advanced SQL",
    "App Dev Environment on Google Cloud Skill Badge",
    "Build a Secure Google Cloud Network Skill Badge",
    "Implement Load Balancing on Compute Engine Skill Badge",
    "Python",
    "SQL",
    "Event scheduling software for NAVAL training",
    "Node-RED",
    "C++",
    "nodejs",
    "postgres",
    ".NET Framework",
    "Objective-C",
    "Flask",
    "docker"
  ],
  ai: [
    "Build natural language processing solution with Azure AI",
    "Classify Images with TensorFlow on Google Cloud",
    "Google Cloud Computing with Machine learning Certificate",
    "Inspect Rich Documents with Gemini Multimodality and Multimodal RAG Skill Badge",
    "Prepare Data for ML APIs on Google Cloud Skill Badge",
    "Analyze Sentiment with Natural Language API Skill Badge",
    "Develop GenAI Apps with Gemini and Streamlit Skill Badge",
    "Gemini for Application Developers",
    "Gemini for Cloud Architects",
    "Gemini for Data Scientists and Analysts",
    "Intermediate Machine Learning",
    "Machine Learning",
    "Scikit-Learn",
    "Random Forest",
    "Artificial Intelligence (AI)",
    "Large Language Models (LLM)",
    "Generative AI",
    "Gemini"
  ]
};

const CertificationCard = ({ certification }) => {
  if (!certification) return null;

  const handleCardClick = (e) => {
    // Don't navigate if clicking the link icon
    if (e.target.closest('.MuiIconButton-root')) {
      e.stopPropagation();
      return;
    }
    if (certification.credential_url) {
      window.open(certification.credential_url, '_blank');
    }
  };

  return (
    <Card
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      sx={{
        height: '25.6em',
        display: 'flex',
        flexDirection: 'column',
        cursor: certification.credential_url ? 'pointer' : 'default',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <SchoolIcon sx={{ mr: 1, color: '#90caf9', mt: 0.5 }} />
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.3,
                height: '2.6em',
                fontWeight: 'bold',
                color: '#000'
              }}
            >

             {certification.title}
            </Typography>
          </Box>
          {certification.credential_url && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                window.open(certification.credential_url, '_blank');
              }}
              sx={{ color: '#90caf9', ml: 1 }}
            >
              <LinkIcon />
            </IconButton>
          )}
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            fontWeight: 500
          }}
        >
          {certification.issuer}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {certification.issue_date}
        </Typography>
        {certification.credential_id && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            gutterBottom
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical'
            }}
          >
            ID: {certification.credential_id}
          </Typography>
        )}
        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {certification.skills?.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              size="small"
              sx={{
                backgroundColor: 'rgba(144, 202, 249, 0.1)',
                color: '#000000',
                '&:hover': {
                  backgroundColor: 'rgba(144, 202, 249, 0.5)'
                }
              }}
            />
          ))}
          
        </Box>
      </CardContent>
    </Card>
  );
};

const CertificationsSection = () => {
  const { data, loading } = useData();
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    console.log('Data:', data);
    console.log('Loading:', loading);
  }, [data, loading]);

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show loading state if data or linkedin data is not available
  if (!data || !data.linkedin) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Ensure certifications array exists
  const certifications = data.linkedin.certifications || [];

  const filteredCertifications = certifications.filter(cert => {
    if (!cert || !cert.title) return false;
    const category = categories[selectedTab]?.value;
    const categoryTitles = categorizedCertifications[category] || [];
    
    // Check if the certification title or any of its skills match the category
    const titleMatch = categoryTitles.some(title => 
      cert.title.toLowerCase().includes(title.toLowerCase())
    );
    
    const skillsMatch = cert.skills && cert.skills.some(skill => 
      categoryTitles.some(catTitle => 
        skill.toLowerCase().includes(catTitle.toLowerCase())
      )
    );

    return titleMatch || skillsMatch;
  });

  return (
    <Box 
      sx={{ 
        py: 8,
        background: '#000',
        position: 'relative',
        overflow: 'hidden'
      }}
      id="certifications"
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
          Certifications
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': {
                  color: '#90caf9',
                },
                '&:hover': {
                  color: '#90caf9',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#90caf9',
              }
            }}
          >
            {categories.map((category) => (
              <Tab
                key={category.value}
                label={category.label}
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              />
            ))}
          </Tabs>
        </Box>

        <Grid container spacing={3}>
          {filteredCertifications.map((certification, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <ScrollReveal>
                <CertificationCard certification={certification} />
              </ScrollReveal>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CertificationsSection; 