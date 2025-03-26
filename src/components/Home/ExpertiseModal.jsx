import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  useTheme,
  Chip
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ProjectCard = ({ image, title, redirectUrl, skills, details }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        sx={{
          height: '100%',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'all 0.3s',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            boxShadow: theme.shadows[8],
            transform: 'translateY(-4px)'
          }
        }}
        onClick={() => window.open(redirectUrl, '_blank')}
      >
        <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
          <CardMedia
            component="img"
            image={image}
            alt={title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
            {title}
          </Typography>
          {details && (
            <Typography variant="body1" sx={{ mb: 3, color: '#90caf9', lineHeight: 1.6 }}>
              {details}
            </Typography>
          )}
          {skills && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
              {skills.split(' · ').map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ExpertiseModal = ({ open, onClose, title, projects }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: '#000',
          color: 'white'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        p: 3
      }}>
        <Typography variant="h4" component="div" sx={{ color: '#fff', fontWeight: 'bold' }}>
          {title}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ color: '#90caf9' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ProjectCard {...project} />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertiseModal; 