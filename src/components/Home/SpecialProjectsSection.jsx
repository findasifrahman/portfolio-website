import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ChevronLeft, ChevronRight, Launch, ExpandMore, ExpandLess } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ScrollReveal from '../shared/ScrollReveal';

const specialProjects = [
  {
    title: "AutoSol GPS based vehicle, asset Tracking solution",
    details: "AutoSol is an application to track and control vehicles remotely. AutoSol can connect with Concox devices and provide location on map, notification for over speed, driver behaviour in both Android and iOS mobile. AutoSol also provides a web application where user can view reports of fuel consumption and mileage. AutoSol can also be used to control the device engine. AutoSol is hosted in Amazon EC2 instance. Integration with hardware alongside mobile and web app is fully developed by me. AutoSol app is available in Play Store for free.",
    images: [
      "/assets/img/products/autosol/autosol_2.jpg",
      "/assets/img/products/autosol/autosol_1.jpg",
      "/assets/img/products/autosol/autosol_3.jpg",
      "/assets/img/products/autosol/autosol_4.jpg",
      "/assets/img/products/autosol/autosol_5.jpg",
      "/assets/img/products/autosol/autosol_6.jpg",
      "/assets/img/products/autosol/autosol_7.jpg",
      "/assets/img/products/autosol/autosol_8.jpg",
      "/assets/img/products/autosol/autosol_9.jpg",
      "/assets/img/products/autosol/autosol_10.jpg"
    ],
    link: "https://www.intricatlab.com/"
  },
  {
    title: "Radio Frequency(RF) communication device design",
    details: "TMS (Tactical Messaging System) is a radio communication device capable to pass peer to peer short message and provide real time location of each connected node using UHF band frequency. This is used in Marine environment for live saving communication. The device includes radio communication IC and uses single board computer for user interface. The device is developed to run in completely offline marine environment. The hardware design, amplifier, microcontroller and software user interface all are Developed solely by me. Bangladesh Coast guard already using the device successfully for over a year in marine environment.",
    images: [
      "/assets/img/products/uhf/uhf_3.png",
      "/assets/img/products/uhf/uhf_4.png",
      "/assets/img/products/uhf/uhf_1.png",
      "/assets/img/products/uhf/uhf_2.jpg"
    ],
    link: "https://www.linkedin.com/posts/asifrahman10018_bijoy-50-tactical-messaging-system-radio-activity-7178334044256972801-5Gb3"
  },
  {
    title: "Zynq SoC based high-performance PCB design",
    details: "zues high-performance PCB is a 10-layer Zynq SoC board built with KiCad-8 and can be loaded petalinix!This compact board is packed with robust features:LPDDR3 RAM (implemented with multiple mtk fly-by routing)8GB eMMC storage, Gigabit Ethernet,High-Speed USB, Dual HDMI Interfaces, This project was both challenging and rewarding, pushing my design skills to the next level. I'm thrilled about the outcome and eager to connect with fellow professionals, enthusiasts, or companies interested in innovative hardware design",
    images: [
      "/assets/img/products/zynq/zynq_1.png",
      "/assets/img/products/zynq/zynq_2.png",
      "/assets/img/products/zynq/zynq_3.png"
    ],
    link: "#"
  },
  {
    title: "CML Microsystems baseband RF radio design",
    details: "The CMX994 is a family of direct conversion receiver ICs for greater DMR conversion RF radio design. I successfully designed the PCB for the device using KiCad. The PCB is a 4 layer board with a 100MHz crystal oscillator and a 12.288MHz crystal oscillator. The PCB is designed to be used in a 5G radio system",
    images: [
      "/assets/img/products/sicomm/sicomm_1.png",
      "/assets/img/products/sicomm/sicomm_2.png"
    ],
    link: "#"
  },
  {
    title: "STM32 based development board",
    details: "This is a development board for the STM32 microcontroller. The board is a 4 layer board with a 100MHz crystal oscillator and a 12.288MHz crystal oscillator. ",
    images: [
      "/assets/img/products/stm32/stm32_1.png",
      "/assets/img/products/stm32/stm32_2.png"
    ],
    link: "#"
  },
  {
    title: "Production AI agent for whatsapp lead generation",
    details: "AI-driven education advisory platform (multi-intake, multi-degree, scholarship logic): Developed an AI agent integrated with WhatsApp to assist prospective students in selecting suitable degree programs based on their preferences and qualifications. The agent utilizes natural language processing to understand user queries and provides personalized recommendations, including scholarship opportunities. Built using Node.js, Python, and OpenAI's GPT-4 API, the system is deployed on VPS",
    images: [
      "/assets/img/products/ai_agent_malishaedu/1.png",
      "/assets/img/products/ai_agent_malishaedu/2.png",
      "/assets/img/products/erp/saas_1.png"
    ],
    link: "#"
  },
  {
    title: "VPN Router & PCB with OpenWRT and mt76xx from mediatek",
    details: "Wemey is a WiFi based home automation device to control light, fan, AC in smart home system with smartphone. I developed the hardware and software for the device using ESP32 microcontroller and ESP_IDF. I also developed the mobile app for the device using JAVA. I also developed the PCB using kicad. Our IOT productline also includes fingerprint recognition system. I developed the fingerprint recognition software . I also developed the PCB using kicad. Our IOT productline also includes fingerprint recognition system and NODE-RED based automation system.",
    images: [
      "/assets/img/products/iot/iot_1.jpg",
      "/assets/img/products/iot/iot_2.png",
      "/assets/img/products/iot/iot_3.jpg"
    ],
    link: "#"
  }
];

const ProjectDetails = ({ details }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const firstFiftyWords = details.split(' ').slice(0, 50).join(' ') + '...';
  const shouldShowReadMore = details.split(' ').length > 50;

  return (
    <Box>
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
          transformStyle: 'preserve-3d'
        }}
      >
        {isExpanded ? details : firstFiftyWords}
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
    </Box>
  );
};

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        width: '100%', 
        height: isMobile ? '300px' : '400px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <motion.img
        key={currentIndex}
        src={images[currentIndex]}
        alt={`Project image ${currentIndex + 1}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          borderRadius: '12px'
        }}
      />
      {images.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            <ChevronLeft sx={{ color: 'white' }} />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            <ChevronRight sx={{ color: 'white' }} />
          </IconButton>
        </>
      )}
    </Box>
  );
};

const SpecialProjectsSection = () => {
  return (
    <Box 
      sx={{ 
        py: 8,
        background: '#000',
        position: 'relative',
        overflow: 'hidden'
      }}
      id="projects"
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
            mb: 8,
            color: '#fff',
            fontWeight: 'bold',
            textShadow: '0 4px 8px rgba(0,0,0,0.5)',
            transform: 'translateZ(30px)',
            perspective: '1000px',
            transformStyle: 'preserve-3d',
            background: 'linear-gradient(45deg,rgb(249, 144, 223), #cc3322)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Special Projects
        </Typography>

        {specialProjects.map((project, index) => (
          <ScrollReveal key={index}>
            <Grid 
              container 
              spacing={4} 
              alignItems="center"
              sx={{ 
                mb: 12,
                mt: index === 0 ? 0 : 8,
                '&:last-child': { mb: 0 }
              }}
            >
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography
                    variant="h4"
                    component="h3"
                    gutterBottom
                    sx={{
                      color: '#90caf9',
                      fontWeight: 'bold',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      transform: 'translateZ(20px)',
                      perspective: '1000px',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {project.title}
                  </Typography>
                  <ProjectDetails details={project.details} />
                  <Button
                    variant="outlined"
                    endIcon={<Launch />}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#90caf9',
                      borderColor: '#90caf9',
                      '&:hover': {
                        borderColor: '#64b5f6',
                        backgroundColor: 'rgba(144, 202, 249, 0.1)'
                      }
                    }}
                  >
                    View Project
                  </Button>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ImageCarousel images={project.images} />
                </motion.div>
              </Grid>
            </Grid>
          </ScrollReveal>
        ))}
      </Container>
    </Box>
  );
};

export default SpecialProjectsSection; 