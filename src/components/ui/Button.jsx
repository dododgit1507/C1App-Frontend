// src/components/ui/Button.jsx
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-slate-700 text-white shadow-sm hover:bg-slate-600',
    secondary: 'bg-slate-800 border border-slate-600 text-slate-200 hover:border-slate-500',
    success: 'bg-slate-600 text-white shadow-sm hover:bg-slate-500',
    danger: 'bg-slate-600 text-white shadow-sm hover:bg-slate-500',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-800',
    outline: 'border border-slate-600 text-slate-300 hover:bg-slate-800'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={ref}
      className={`
        relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-600/50
        ${variants[variant]}
        ${sizes[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={!isDisabled ? { 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400 }
      } : {}}
      whileTap={!isDisabled ? { 
        scale: 0.98,
        transition: { type: "spring", stiffness: 600 }
      } : {}}
      disabled={isDisabled}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Icon */}
      {icon && !loading && (
        <span className="text-lg">{icon}</span>
      )}

      {/* Content */}
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>

      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-xl opacity-0"
        whileHover={!isDisabled ? { opacity: 1 } : {}}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;