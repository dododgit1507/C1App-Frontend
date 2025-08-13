// src/components/ui/CleanTextarea.jsx
import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';

const CleanTextarea = forwardRef(({ 
  label,
  placeholder,
  error,
  rows = 4,
  className = '',
  value,
  onChange,
  maxLength,
  showCount = true,
  voiceButton,
  isListening = false,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const currentLength = value?.length || 0;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <motion.label
          className="block text-sm font-medium text-slate-300"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.label>
      )}
      
      <motion.div
        className={`
          relative transition-all duration-200
          ${isFocused ? 'scale-[1.005]' : 'scale-100'}
        `}
      >
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-3 sm:px-4 py-3 border border-slate-600 rounded-lg
            placeholder-slate-400 text-white bg-slate-800
            focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20
            transition-all duration-200 resize-none text-sm sm:text-base
            ${voiceButton ? 'pr-12 sm:pr-16' : ''}
            ${isListening ? 'border-slate-500 bg-slate-700' : ''}
            ${error ? 'border-red-400 focus:border-red-400' : ''}
            touch-manipulation
          `}
          {...props}
        />

        {/* Voice Button */}
        {voiceButton && (
          <motion.div
            className="absolute top-2 sm:top-3 right-2 sm:right-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              type="button"
              onClick={voiceButton.onClick}
              className={`
                p-1.5 sm:p-2 rounded-lg transition-all duration-200 flex items-center justify-center
                ${isListening
                  ? 'bg-slate-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }
              `}
              title={isListening ? 'Grabando... (Toca para parar)' : 'Grabar audio'}
            >
              {isListening ? (
                <Square className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" />
              ) : (
                <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </button>
          </motion.div>
        )}

        {/* Listening indicator */}
        {isListening && (
          <motion.div
            className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-xs text-slate-400 font-medium flex items-center gap-1"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" />
            Escuchando...
          </motion.div>
        )}

        {/* Character count */}
        {showCount && maxLength && (
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs text-slate-500">
            {currentLength}/{maxLength}
          </div>
        )}
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.p
          className="text-sm text-red-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

CleanTextarea.displayName = 'CleanTextarea';

export default CleanTextarea;
