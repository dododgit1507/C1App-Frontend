// src/components/ui/Card.jsx
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  className = '', 
  hover = true, 
  variant = 'default',
  padding = 'p-4 sm:p-6',
  ...props 
}, ref) => {
  
  const variants = {
    default: 'bg-slate-800 border border-slate-700 shadow-sm',
    minimal: 'bg-slate-800 border-0 shadow-none',
    elevated: 'bg-slate-800 border border-slate-700 shadow-md',
    subtle: 'bg-slate-700/50 border border-slate-600 shadow-sm'
  };

  return (
    <motion.div
      ref={ref}
      className={`
        rounded-xl transition-all duration-200
        ${variants[variant]}
        ${hover ? 'hover:shadow-lg hover:border-slate-600' : ''}
        ${padding}
        ${className}
      `}
      whileHover={hover ? { 
        y: -1,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export default Card;
