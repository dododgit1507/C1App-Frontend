// src/components/ui/Textarea.jsx
import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';
import { Mic, Square, AlertTriangle } from 'lucide-react';

const Textarea = forwardRef(({ 
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
          ${isFocused ? 'scale-[1.01]' : 'scale-100'}
        `}
        whileFocus={{ scale: 1.01 }}
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
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none
            bg-white/90 backdrop-blur-sm
            ${voiceButton ? 'pr-16' : 'pr-4'}
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

        {/* Voice button */}
        {voiceButton && (
          <motion.div
            className="absolute top-3 right-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              type="button"
              onClick={voiceButton.onClick}
              className={`
                p-3 rounded-full transition-all duration-200 flex items-center justify-center
                ${isListening
                  ? 'bg-slate-600 text-white shadow-lg animate-pulse scale-110'
                  : 'bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg'
                }
              `}
              title={isListening ? 'GRABANDO - Haz clic para parar' : 'Haz clic y habla'}
            >
              <span className="text-base">
                {isListening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </span>
            </button>
          </motion.div>
        )}

        {/* Character count */}
        {showCount && maxLength && (
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            <span className={currentLength > maxLength * 0.9 ? 'text-orange-500' : ''}>
              {currentLength}
            </span>
            <span className="text-gray-300">/{maxLength}</span>
          </div>
        )}

        {/* Listening indicator */}
        {isListening && (
          <motion.div
            className="absolute bottom-3 left-3 text-xs text-slate-600 font-medium flex items-center gap-1"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Mic className="w-4 h-4 mr-2" />
            Escuchando...
          </motion.div>
        )}

        {/* Focus ring */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-blue-500 pointer-events-none"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
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
          <AlertTriangle className="w-4 h-4 mr-2" />
          {error}
        </motion.p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;