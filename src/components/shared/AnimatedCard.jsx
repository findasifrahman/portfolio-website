import React from 'react';
import { Card } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      <Card
        sx={{
          height: '100%',
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: 8,
          },
        }}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard; 