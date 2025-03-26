import React, { useState } from 'react';
import { Box, Container, Grid, Card, CardContent, CardMedia, Typography, Chip, IconButton, Link, CircularProgress, Alert, Button } from '@mui/material';
import { GitHub, Launch, Code } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';

const ProjectCard = ({ project }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;
  const shouldTruncate = project.details?.length > maxLength;
  const displayText = shouldTruncate && !expanded 
    ? `${project.details.substring(0, maxLength)}...` 
    : project.details;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'all 0.3s',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateY(-4px)'
          }
        }}
      >
        {project.imageUrl && (
          <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
            <CardMedia
              component="img"
              image={project.imageUrl}
              alt={project.title}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          </Box>
        )}
        <CardContent sx={{ 
          flexGrow: 1, 
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              color: '#fff', 
              fontWeight: 'bold',
              minHeight: '2.5em'
            }}
          >
            {project.title}
          </Typography>
          <Box sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '8em'
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#90caf9', 
                mb: 2,
                flexGrow: 1
              }}
            >
              {displayText}
              {shouldTruncate && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                  sx={{
                    color: '#64b5f6',
                    p: 0,
                    minWidth: 'auto',
                    ml: 1,
                    '&:hover': {
                      background: 'none',
                      color: '#90caf9'
                    }
                  }}
                >
                  {expanded ? 'Show Less' : 'Read More'}
                </Button>
              )}
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            {project.skills?.split('·').map((skill, index) => (
              <Chip
                key={index}
                label={skill.trim()}
                size="small"
                sx={{
                  mr: 1,
                  mb: 1,
                  backgroundColor: 'rgba(144, 202, 249, 0.2)',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(144, 202, 249, 0.3)'
                  }
                }}
              />
            ))}
          </Box>
          <Box sx={{ 
            mt: 'auto', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center' 
          }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {project.time}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {project.project_link && (
                <IconButton
                  component={Link}
                  href={project.project_link}
                  target="_blank"
                  size="small"
                  sx={{ 
                    color: '#90caf9',
                    '&:hover': {
                      color: '#64b5f6'
                    }
                  }}
                >
                  <Launch />
                </IconButton>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const sampleProjects = [
  {
    title: "CrewAI Scraping Agent",
    details: "An advanced web scraping system using CrewAI framework that orchestrates multiple AI agents for intelligent data extraction. Features include multi-agent collaboration, RAG implementation, automated data processing, and performance monitoring.",
    skills: "Multi-agent Systems · Machine Learning · AI · Web Scraping · RAG",
    time: "2024",
    project_link: "https://github.com/findasifrahman/llm-scraper"
  }
];

const ProjectsSection = () => {
  const { data, loading, error } = useData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Use only the projects from the data context
  const projects = data?.linkedin?.projects || [];

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
          Featured Projects
        </Typography>

        <Grid container spacing={4}>
          {projects.map((project, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProjectsSection; 