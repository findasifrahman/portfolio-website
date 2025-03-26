import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';

const menuItems = [
  { label: 'Home', id: 'home' },
  { label: 'About Me', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Skills & Expertise', id: 'skills' },
  { label: 'Certifications', id: 'certifications' },
  { label: 'Contact', id: 'contact' }
];

const TopMenu = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMobileOpen(false);
    }
  };

  const drawer = (
    <List>
      <ListItem sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#90caf9',
            fontWeight: 'bold',
            fontFamily: '"Playfair Display", serif',
            letterSpacing: '1px',
            background: 'linear-gradient(45deg,rgb(249, 144, 223), #cc3322)',
          }}
        >
          MD ASIFUR RAHMAN
        </Typography>
      </ListItem>
      {menuItems.map((item) => (
        <ListItem 
          button 
          key={item.id}
          onClick={() => scrollToSection(item.id)}
        >
          <ListItemText 
            primary={item.label}
            sx={{
              color: '#fff',
              '& .MuiListItemText-primary': {
                fontFamily: '"Playfair Display", serif',
                fontSize: '1.1rem',
                letterSpacing: '0.5px'
              },
              '&:hover': {
                color: '#90caf9'
              }
            }}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        height: '80px'
      }}
    >
      <Container maxWidth="lg" sx={{ height: '100%' }}>
        <Toolbar sx={{ height: '100%', px: { xs: 2, md: 0 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              color: '#90caf9',
              fontWeight: 'bold',
              fontFamily: '"Playfair Display", serif',
              letterSpacing: '1px',
              mr: 4,
              display: { xs: 'none', md: 'block' },
              minWidth: '200px'
            }}
          >
            MD ASIFUR RAHMAN
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2, justifyContent: 'center' }}>
            {menuItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  color="inherit"
                  onClick={() => scrollToSection(item.id)}
                  sx={{
                    color: '#fff',
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '1rem',
                    letterSpacing: '0.5px',
                    textTransform: 'none',
                    '&:hover': {
                      color: '#90caf9',
                      backgroundColor: 'rgba(144, 202, 249, 0.1)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}
          </Box>
        </Toolbar>
      </Container>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            pt: 2
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default TopMenu; 