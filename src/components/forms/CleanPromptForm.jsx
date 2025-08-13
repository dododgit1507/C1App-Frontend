// src/components/forms/CleanPromptForm.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// UI Components
import Card from '../ui/Card';
import Button from '../ui/Button';
import CleanTextarea from '../ui/CleanTextarea';

// Services
import { selectorModelo } from '../../services/selectorModelo';
import { apiClient } from '../../services/apiClient';

const CleanPromptForm = ({ onSubmit }) => {
  // Form state
  const [formData, setFormData] = useState({
    areaNegocio: '',
    objetivo: '',
    reto: ''
  });

  // Voice recognition state
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState({
    principal: false,
    objetivo: false,
    reto: false
  });
  const [procesandoAudio, setProcesandoAudio] = useState(false);
  const [audioCompleto, setAudioCompleto] = useState('');
  const recognitionRef = useRef(null);

  // Model selection
  const [modeloManual, setModeloManual] = useState('');
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);

  // Check voice support on mount
  useEffect(() => {
    const checkVoiceSupport = () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        setVoiceSupported(true);
        try {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          recognitionRef.current = new SpeechRecognition();
        } catch (error) {
          setVoiceSupported(false);
        }
      } else {
        setVoiceSupported(false);
      }
    };
    checkVoiceSupport();
  }, []);

  // Business areas data - Diseño minimalista
  const areasNegocio = [
    { id: 'marketing', nombre: 'Marketing y Ventas', initial: 'M' },
    { id: 'programacion', nombre: 'Programación y Desarrollo', initial: 'D' },
    { id: 'finanzas', nombre: 'Finanzas y Contabilidad', initial: 'F' },
    { id: 'recursos-humanos', nombre: 'Recursos Humanos', initial: 'H' },
    { id: 'atencion-cliente', nombre: 'Atención al Cliente', initial: 'C' },
    { id: 'educacion', nombre: 'Educación y Formación', initial: 'E' },
    { id: 'salud', nombre: 'Salud y Medicina', initial: 'S' },
    { id: 'creatividad', nombre: 'Creatividad y Diseño', initial: 'A' }
  ];

  // AI Models data - Minimalista
  const modelos = [
    { id: 'gpt-4', name: 'GPT-4', desc: 'Análisis profundo' },
    { id: 'claude-3-opus', name: 'Claude 3', desc: 'Creatividad' },
    { id: 'gemini-1.5-pro', name: 'Gemini Pro', desc: 'Datos actuales' },
    { id: 'deepseek', name: 'DeepSeek', desc: 'Técnico' }
  ];

  // Voice processing
  const procesarAudioConGPT = async (textoCompleto) => {
    setProcesandoAudio(true);
    try {
      const resultado = await apiClient.interpretarVoz(textoCompleto);
      const areasValidas = ['marketing', 'programacion', 'finanzas', 'recursos-humanos', 'atencion-cliente', 'educacion', 'salud', 'creatividad'];
      if (!areasValidas.includes(resultado.areaNegocio)) {
        resultado.areaNegocio = 'marketing';
      }
      setFormData(resultado);
      setAudioCompleto('');
    } catch (error) {
      console.error('Error procesando audio:', error);
    } finally {
      setProcesandoAudio(false);
    }
  };

  // Voice recognition handlers
  const toggleVoiceRecognition = (field) => {
    if (!voiceSupported) return;

    if (isListening[field]) {
      recognitionRef.current?.stop();
      setIsListening(prev => ({ ...prev, [field]: false }));
      return;
    }

    try {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';

      let finalTranscript = '';
      let interimTranscript = '';

      recognitionRef.current.onstart = () => {
        setIsListening(prev => ({ ...prev, [field]: true }));
      };

      recognitionRef.current.onresult = (event) => {
        interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (field === 'principal') {
          setAudioCompleto(finalTranscript + interimTranscript);
        } else {
          setFormData(prev => ({ 
            ...prev, 
            [field]: finalTranscript + interimTranscript 
          }));
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(prev => ({ ...prev, [field]: false }));
        if (field === 'principal' && finalTranscript.trim()) {
          procesarAudioConGPT(finalTranscript);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(prev => ({ ...prev, [field]: false }));
      };

      recognitionRef.current.start();
    } catch (error) {
      setIsListening(prev => ({ ...prev, [field]: false }));
    }
  };

  // Model selection logic
  const seleccionarModelo = async () => {
    if (!formData.areaNegocio || !formData.objetivo) return;

    try {
      const resultado = selectorModelo.analizarYSeleccionar(
        formData.areaNegocio,
        formData.objetivo,
        formData.reto
      );
      setModeloSeleccionado(resultado);
    } catch (error) {
      console.error('Error seleccionando modelo:', error);
    }
  };

  useEffect(() => {
    seleccionarModelo();
  }, [formData.areaNegocio, formData.objetivo, formData.reto]);

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.areaNegocio || !formData.objetivo) return;

    const modelo = modeloManual || modeloSeleccionado?.modelo || 'gpt-4';
    
    const dataToSend = {
      ...formData,
      modelo
    };
    
    console.log('📤 Enviando datos desde CleanPromptForm:', dataToSend);
    
    onSubmit(dataToSend);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      {/* Título de sección */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h2 className="text-xl sm:text-2xl font-light text-white mb-2">
          Configuración del Prompt
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          Define los parámetros para generar tu prompt optimizado
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        
        {/* Voice Input Principal */}
        {voiceSupported && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card variant="subtle" className="max-w-md mx-auto">
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-medium text-white mb-4">
                  Entrada por Voz
                </h3>
                <Button
                  type="button"
                  onClick={() => toggleVoiceRecognition('principal')}
                  loading={procesandoAudio}
                  variant={isListening.principal ? 'danger' : 'primary'}
                  size="lg"
                  className="w-full text-sm sm:text-base"
                >
                  {isListening.principal 
                    ? 'Grabando... (Toca para parar)' 
                    : procesandoAudio 
                    ? 'Procesando...' 
                    : 'Describir Idea Completa'
                  }
                </Button>
                {audioCompleto && (
                  <p className="text-xs sm:text-sm text-slate-300 mt-3 p-3 bg-slate-700 rounded-lg">
                    "{audioCompleto}"
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Área de Negocio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <h3 className="text-base sm:text-lg font-medium text-white mb-4 sm:mb-6">
              1. Área de Negocio
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {areasNegocio.map((area) => (
                <motion.button
                  key={area.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, areaNegocio: area.id }))}
                  className={`
                    p-3 sm:p-4 rounded-lg border transition-all duration-200 text-left min-h-[70px] sm:min-h-[auto]
                    ${formData.areaNegocio === area.id
                      ? 'border-slate-400 bg-slate-700 text-white'
                      : 'border-slate-600 hover:border-slate-500 bg-slate-800 text-slate-200'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`
                    w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold mb-1 sm:mb-2
                    ${formData.areaNegocio === area.id
                      ? 'bg-slate-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                    }
                  `}>
                    {area.initial}
                  </div>
                  <div className="text-xs sm:text-sm font-medium leading-tight">
                    {area.nombre}
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Objetivo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h3 className="text-base sm:text-lg font-medium text-white mb-2">
              2. Objetivo Principal
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-4">
              Describe claramente qué quieres lograr con este prompt
            </p>
            
            <CleanTextarea
              value={formData.objetivo}
              onChange={(value) => setFormData(prev => ({ ...prev, objetivo: value }))}
              placeholder="Describe qué quieres lograr..."
              rows={4}
              maxLength={500}
              voiceButton={voiceSupported ? {
                onClick: () => toggleVoiceRecognition('objetivo')
              } : null}
              isListening={isListening.objetivo}
            />
          </Card>
        </motion.div>

        {/* Reto (Opcional) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="subtle">
            <h3 className="text-base sm:text-lg font-medium text-white mb-2">
              3. Desafío Principal <span className="text-xs sm:text-sm font-normal text-slate-400">(Opcional)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-4">
              Describe el principal obstáculo o limitación que enfrentas
            </p>
            
            <CleanTextarea
              value={formData.reto}
              onChange={(value) => setFormData(prev => ({ ...prev, reto: value }))}
              placeholder="¿Cuál es el principal desafío?"
              rows={3}
              maxLength={300}
              voiceButton={voiceSupported ? {
                onClick: () => toggleVoiceRecognition('reto')
              } : null}
              isListening={isListening.reto}
            />
          </Card>
        </motion.div>

        {/* Recomendación de Modelo */}
        <AnimatePresence>
          {formData.areaNegocio && formData.objetivo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-slate-600">
                <h3 className="text-base sm:text-lg font-medium text-white mb-4">
                  Recomendación de Modelo IA
                </h3>
                
                {modeloSeleccionado && (
                  <div className="mb-4 p-3 sm:p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white text-sm sm:text-base">
                        {modeloSeleccionado.modelo}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-300">
                        Recomendado
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {modeloSeleccionado.razonamiento}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {modelos.map((modelo) => (
                    <motion.button
                      key={modelo.id}
                      type="button"
                      onClick={() => setModeloManual(modelo.id)}
                      className={`
                        p-3 sm:p-4 rounded-lg border transition-all duration-200 text-left
                        ${modeloManual === modelo.id
                          ? 'border-slate-400 bg-slate-700 text-white'
                          : 'border-slate-600 hover:border-slate-500 bg-slate-800 text-slate-200'
                        }
                      `}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-medium text-sm sm:text-base">
                        {modelo.name}
                      </div>
                      <div className="text-xs sm:text-sm opacity-75 mt-1">
                        {modelo.desc}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center pt-4"
        >
          <Button
            type="submit"
            size="lg"
            disabled={!formData.areaNegocio || !formData.objetivo}
            className="px-8 sm:px-12 py-3 sm:py-4 w-full sm:w-auto text-sm sm:text-base"
          >
            Generar Prompt Optimizado
          </Button>
        </motion.div>

      </form>
    </div>
  );
};

export default CleanPromptForm;
