import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -24 }}
    transition={{ duration: 0.45, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
