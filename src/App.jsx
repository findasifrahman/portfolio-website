import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Box, CircularProgress, Alert, CssBaseline } from '@mui/material';
import MainLayout from './components/Layout/MainLayout';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import PageTransition from './components/Layout/PageTransition';
import SEOHead from './components/SEO/SEOHead';
import Navbar from './components/Navbar/Navbar';

// Import components
import HeroSection from './components/Home/HeroSection';
import BioSection from './components/Home/BioSection';
import SpecialProjectsSection from './components/Home/SpecialProjectsSection';
import ProjectsSection from './components/Projects/ProjectsSection';
import SkillsSection from './components/Skills/SkillsSection';
import CertificationsSection from './components/Certifications/CertificationsSection';
import GitHubSection from './components/GitHub/GitHubSection';
import YouTubeSection from './components/YouTube/YouTubeSection';
import ContactSection from './components/Home/ContactSection';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot/Chatbot';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

const PageWrapper = ({ children }) => {
  const { loading, error } = useData();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
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

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <CustomThemeProvider>
      <MuiThemeProvider theme={darkTheme}>
        <CssBaseline />
        <DataProvider>
          <Router>
            <Navbar />
            <SEOHead 
              description="Software Engineer & Embedded System Designer specializing in hardware design, AI/ML, and full-stack development"
            />
            <MainLayout>
              <PageWrapper>
                <Routes>
                  <Route path="/" element={
                    <>
                      <SEOHead title="Home" />
                      <HeroSection />
                      <BioSection />
                      <SpecialProjectsSection />
                      <ProjectsSection />
                      <SkillsSection />
                      <CertificationsSection />
                      <ContactSection />
                      <Chatbot />
                      <Footer />
                    </>
                  } />
                  <Route path="/projects" element={
                    <>
                      <SEOHead title="Projects" />
                      <ProjectsSection />
                    </>
                  } />
                  <Route path="/skills" element={<SkillsSection />} />
                  <Route path="/certifications" element={<CertificationsSection />} />
                  <Route path="/github" element={<GitHubSection />} />
                  <Route path="/youtube" element={<YouTubeSection />} />
                  <Route path="/contact" element={<ContactSection />} />
                </Routes>
              </PageWrapper>
            </MainLayout>
          </Router>
        </DataProvider>
      </MuiThemeProvider>
    </CustomThemeProvider>
  );
};

export default App; 