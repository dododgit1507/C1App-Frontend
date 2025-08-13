// src/components/layout/Header.jsx
import { motion } from 'framer-motion';

const Header = ({ subtitle }) => {
  return (
    <motion.header 
      className="text-center mb-8 sm:mb-12 md:mb-16 px-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Logo y título minimalista */}
      <motion.div
        className="mb-6 sm:mb-8"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="inline-flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-light tracking-tight text-white">
              Hannah<span className="font-semibold">Prompts</span>
            </h1>
            <motion.div
              className="absolute -bottom-1 left-0 h-0.5 bg-slate-400"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Subtítulo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-light px-2 sm:px-4">
          {subtitle || "Sistema inteligente de optimización de prompts"}
        </p>
        
        {/* Indicador de estado minimalista */}
        <motion.div
          className="inline-flex items-center gap-2 mt-4 sm:mt-6 px-3 sm:px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-xs sm:text-sm"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" />
          Activo
        </motion.div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
