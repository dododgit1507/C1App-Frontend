// src/components/ui/Input.jsx
import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';

const Input = forwardRef(({ 
  label,
  placeholder,
  error,
  icon,
  type = 'text',
  className = '',
  value,
  onChange,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <motion.label
          className="block text-sm font-semibold text-gray-700"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.label>
      )}
      
      <motion.div
        className={`
          relative rounded-xl transition-all duration-200
          ${isFocused ? 'scale-[1.02]' : 'scale-100'}
        `}
        whileFocus={{ scale: 1.02 }}
      >
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
            bg-white/90 backdrop-blur-sm
            ${icon ? 'pl-12' : 'pl-4'}
            ${isFocused 
              ? 'border-blue-500 shadow-lg shadow-blue-500/25 bg-white' 
              : error 
                ? 'border-red-500 shadow-lg shadow-red-500/25' 
                : 'border-gray-200 hover:border-gray-300'
            }
            focus:outline-none placeholder-gray-400
            ${error ? 'text-red-700' : 'text-gray-900'}
          `}
          {...props}
        />

        {/* Focus ring */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-blue-500 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>

      {error && (
        <motion.p
          className="text-sm text-red-600 flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span>⚠️</span>
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
