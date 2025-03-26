import React from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Link } from '@mui/material';
import { motion } from 'framer-motion';

const VideoCard = ({ video }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="180"
          image={video.thumbnail}
          alt={video.title}
        />
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            <Link href={video.url} target="_blank" color="inherit" underline="hover">
              {video.title}
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {video.description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const YouTubeSection = ({ videos }) => {
  return (
    <Box sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        YouTube Content
      </Typography>
      <Grid container spacing={4}>
        {videos.map((video) => (
          <Grid item key={video.url} xs={12} sm={6} md={4}>
            <VideoCard video={video} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default YouTubeSection; 