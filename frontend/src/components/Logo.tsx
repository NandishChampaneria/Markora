import React from 'react';
import { motion } from 'framer-motion';
import { MdOutlineWaterDrop } from "react-icons/md";

const Logo = ({ className = "" }) => {
  return (
    <motion.div 
      className={`flex items-center space-x-2 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur-sm opacity-50"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <MdOutlineWaterDrop className="w-6 h-6 text-white relative z-10" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text tracking-tight">
        Markora
      </span>
    </motion.div>
  );
};

export default Logo; 