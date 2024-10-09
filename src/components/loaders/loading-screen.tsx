import React from "react";
import { motion } from "framer-motion";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
      <motion.div
        className="w-16 h-16 border-t-4 border-blue-500 rounded-full"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.h2
        className="ml-4 text-2xl font-bold text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Loading...
      </motion.h2>
    </div>
  );
};

export default LoadingScreen;
