import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Link, Chip, IconButton } from '@mui/material';
import { GitHub, Star, CallSplit } from '@mui/icons-material';
import { motion } from 'framer-motion';

const RepoCard = ({ repo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            <Link href={repo.html_url} target="_blank" color="inherit" underline="hover">
              {repo.name}
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {repo.description}
          </Typography>
          <Box sx={{ mb: 2 }}>
            {Object.keys(repo.languages || {}).map((lang) => (
              <Chip
                key={lang}
                label={lang}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
          <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Star fontSize="small" sx={{ mr: 0.5 }} />
              {repo.stargazers_count}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CallSplit fontSize="small" sx={{ mr: 0.5 }} />
              {repo.forks_count}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const GitHubSection = ({ repos }) => {
  return (
    <Box sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        GitHub Projects
      </Typography>
      <Grid container spacing={4}>
        {repos.map((repo) => (
          <Grid item key={repo.id} xs={12} sm={6} md={4}>
            <RepoCard repo={repo} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GitHubSection; 