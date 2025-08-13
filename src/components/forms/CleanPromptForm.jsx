// src/components/forms/CleanPromptForm.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Code, 
  DollarSign, 
  Users, 
  Headphones, 
  GraduationCap, 
  Heart, 
  Palette,
  Mic,
  MicOff
} from 'lucide-react';

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

  // Auto-analysis state (para mostrar sugerencias después del audio)
  const [sugerenciasAutomaticas, setSugerenciasAutomaticas] = useState(null);

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
  const silenceTimeoutRef = useRef(null);

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

  // Business areas data - Con iconos de Lucide
  const areasNegocio = [
    { id: 'marketing', nombre: 'Marketing y Ventas', icon: TrendingUp },
    { id: 'programacion', nombre: 'Programación y Desarrollo', icon: Code },
    { id: 'finanzas', nombre: 'Finanzas y Contabilidad', icon: DollarSign },
    { id: 'recursos-humanos', nombre: 'Recursos Humanos', icon: Users },
    { id: 'atencion-cliente', nombre: 'Atención al Cliente', icon: Headphones },
    { id: 'educacion', nombre: 'Educación y Formación', icon: GraduationCap },
    { id: 'salud', nombre: 'Salud y Medicina', icon: Heart },
    { id: 'creatividad', nombre: 'Creatividad y Diseño', icon: Palette }
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
      
      // Activar sugerencias automáticas y rellenar formulario
      setSugerenciasAutomaticas(resultado);
      setFormData(prev => ({
        ...prev,
        areaNegocio: resultado.areaNegocio,
        objetivo: resultado.objetivo,
        reto: resultado.reto
      }));
      
      console.log('✅ Análisis por audio completado. Campos seleccionados automáticamente.');
    } catch (error) {
      console.error('Error procesando audio:', error);
      // Fallback al análisis local si falla la IA
      const analisisLocal = analizarTextoLocal(textoCompleto);
      setSugerenciasAutomaticas(analisisLocal);
      setFormData(prev => ({
        ...prev,
        areaNegocio: analisisLocal.areaNegocio,
        objetivo: analisisLocal.objetivo,
        reto: analisisLocal.reto
      }));
      console.log('⚠️ Usando análisis local por audio. Campos seleccionados automáticamente.');
    } finally {
      setProcesandoAudio(false);
    }
  };

  // Local text analysis using keywords (usado como fallback para audio)
  const analizarTextoLocal = (texto) => {
    const textoLower = texto.toLowerCase();
    
    // Definir patrones de palabras clave para cada área (expandidos)
    const patronesArea = {
      'marketing': ['marketing', 'ventas', 'clientes', 'campaña', 'publicidad', 'redes sociales', 'branding', 'conversión', 'leads', 'email marketing', 'seo', 'sem', 'engagement', 'embudo', 'funnel', 'anuncios', 'promoción', 'marca', 'audiencia', 'segmentación', 'cta', 'landing', 'contenido', 'influencer', 'viral', 'métricas', 'cac', 'ltv', 'roi'],
      'programacion': ['código', 'programar', 'desarrollo', 'software', 'aplicación', 'web', 'api', 'base de datos', 'frontend', 'backend', 'javascript', 'python', 'react', 'node', 'algoritmo', 'debugging', 'framework', 'biblioteca', 'repositorio', 'git', 'testing', 'deployment', 'servidor', 'hosting', 'responsive', 'móvil', 'performance', 'optimización', 'seguridad', 'autenticación'],
      'finanzas': ['dinero', 'finanzas', 'presupuesto', 'inversión', 'contabilidad', 'gastos', 'ingresos', 'roi', 'beneficios', 'costos', 'facturación', 'impuestos', 'flujo de caja', 'capital', 'rentabilidad', 'margen', 'ebitda', 'balance', 'estados financieros', 'análisis financiero', 'proyección', 'forecast', 'kpi financiero', 'pricing', 'monetización'],
      'recursos-humanos': ['empleados', 'personal', 'recursos humanos', 'rrhh', 'talento', 'reclutamiento', 'capacitación', 'evaluación', 'nómina', 'bienestar', 'cultura organizacional', 'onboarding', 'performance', 'feedback', 'desarrollo profesional', 'liderazgo', 'team building', 'compensación', 'beneficios', 'rotación', 'retención', 'clima laboral', 'engagement'],
      'atencion-cliente': ['clientes', 'soporte', 'atención', 'servicio', 'quejas', 'satisfacción', 'chat', 'helpdesk', 'tickets', 'resolución', 'experiencia del cliente', 'cx', 'nps', 'csat', 'tiempo de respuesta', 'escalación', 'faq', 'knowledge base', 'autoservicio', 'calidad', 'seguimiento', 'fidelización'],
      'educacion': ['enseñar', 'educación', 'estudiantes', 'curso', 'capacitación', 'aprendizaje', 'formación', 'lecciones', 'academia', 'universidad', 'e-learning', 'lms', 'currículo', 'pedagogía', 'evaluación', 'certificación', 'webinar', 'tutorial', 'mentoring', 'coaching', 'metodología', 'competencias'],
      'salud': ['salud', 'medicina', 'pacientes', 'tratamiento', 'diagnóstico', 'hospital', 'clínica', 'médico', 'enfermería', 'terapia', 'bienestar', 'prevención', 'rehabilitación', 'farmacia', 'telemedicina', 'historial médico', 'síntomas', 'procedimiento', 'cirugía', 'consulta', 'emergencia'],
      'creatividad': ['diseño', 'creatividad', 'arte', 'gráfico', 'imagen', 'video', 'contenido', 'creativo', 'visual', 'multimedia', 'ilustración', 'fotografía', 'animación', 'branding', 'ui/ux', 'prototipo', 'mockup', 'portfolio', 'concepto', 'storytelling', 'narrativa', 'producción']
    };

    // Buscar área más probable
    let areaMasProbable = 'marketing';
    let maxCoincidencias = 0;
    
    Object.entries(patronesArea).forEach(([area, palabras]) => {
      const coincidencias = palabras.filter(palabra => textoLower.includes(palabra)).length;
      if (coincidencias > maxCoincidencias) {
        maxCoincidencias = coincidencias;
        areaMasProbable = area;
      }
    });

    // Extraer objetivo probable (mejorado)
    let objetivo = '';
    const patronesObjetivo = {
      'aumentar': ['aumentar', 'incrementar', 'mejorar', 'subir', 'crecer', 'potenciar', 'expandir', 'ampliar', 'maximizar', 'elevar'],
      'reducir': ['reducir', 'disminuir', 'bajar', 'minimizar', 'ahorrar', 'recortar', 'limitar', 'controlar', 'eficientar'],
      'optimizar': ['optimizar', 'eficientar', 'automatizar', 'acelerar', 'streamlining', 'perfeccionar', 'refinar'],
      'crear': ['crear', 'desarrollar', 'construir', 'generar', 'producir', 'diseñar', 'lanzar', 'implementar', 'establecer'],
      'analizar': ['analizar', 'estudiar', 'revisar', 'evaluar', 'medir', 'investigar', 'monitorear', 'examinar']
    };

    Object.entries(patronesObjetivo).forEach(([tipo, palabras]) => {
      palabras.forEach(palabra => {
        if (textoLower.includes(palabra) && !objetivo) {
          if (tipo === 'aumentar') objetivo = 'Aumentar ventas/conversiones';
          else if (tipo === 'reducir') objetivo = 'Reducir costos/tiempos';
          else if (tipo === 'optimizar') objetivo = 'Optimizar procesos';
          else if (tipo === 'crear') objetivo = 'Crear contenido/producto';
          else if (tipo === 'analizar') objetivo = 'Analizar datos/tendencias';
        }
      });
    });

    if (!objetivo) objetivo = 'Mejorar eficiencia general';

    // Extraer reto probable (expandido)
    let reto = '';
    const patronesReto = [
      { palabras: ['tiempo', 'lento', 'demora', 'urgente', 'deadline', 'plazo', 'rápido'], reto: 'Falta de tiempo' },
      { palabras: ['recursos', 'presupuesto', 'dinero', 'caro', 'económico', 'barato', 'limitado', 'escaso'], reto: 'Recursos limitados' },
      { palabras: ['competencia', 'rival', 'mercado', 'competir', 'diferenciarse'], reto: 'Alta competencia' },
      { palabras: ['clientes', 'satisfacción', 'quejas', 'retención', 'fidelidad', 'experiencia'], reto: 'Satisfacción del cliente' },
      { palabras: ['tecnología', 'herramientas', 'sistema', 'plataforma', 'integración', 'technical'], reto: 'Limitaciones tecnológicas' },
      { palabras: ['personal', 'equipo', 'capacidad', 'habilidades', 'conocimiento', 'experiencia', 'formación'], reto: 'Capacitación del equipo' },
      { palabras: ['escalar', 'crecimiento', 'volumen', 'dimensionar', 'expandir'], reto: 'Escalabilidad' },
      { palabras: ['medición', 'métricas', 'resultados', 'tracking', 'analytics'], reto: 'Medición de resultados' }
    ];

    for (const patron of patronesReto) {
      if (patron.palabras.some(palabra => textoLower.includes(palabra))) {
        reto = patron.reto;
        break;
      }
    }

    if (!reto) reto = 'Optimización de procesos';

    return {
      areaNegocio: areaMasProbable,
      objetivo: objetivo,
      reto: reto
    };
  };

  // Voice recognition handlers
  const toggleVoiceRecognition = (field) => {
    if (!voiceSupported) return;

    if (isListening[field]) {
      recognitionRef.current?.stop();
      setIsListening(prev => ({ ...prev, [field]: false }));
      // Limpiar timeouts cuando se para manualmente
      clearTimeout(silenceTimeoutRef.current);
      return;
    }

    try {
      // Limpiar audio anterior al iniciar nueva grabación
      if (field === 'principal') {
        setAudioCompleto('');
      }

      // Configuración más permisiva para descripciones largas
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';
      recognitionRef.current.maxAlternatives = 1;

      let allFinalTranscript = '';
      let currentInterimTranscript = '';

      recognitionRef.current.onstart = () => {
        setIsListening(prev => ({ ...prev, [field]: true }));
        console.log('🎤 Reconocimiento de voz iniciado - Habla tranquilo, tienes tiempo...');
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        
        // Procesar solo los resultados nuevos para evitar duplicación
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            // Solo agregar si no está ya incluido para evitar duplicados
            if (!allFinalTranscript.includes(transcript.trim())) {
              allFinalTranscript += transcript + ' ';
            }
          } else {
            interimTranscript += transcript;
          }
        }

        // Actualizar el estado con el texto acumulado
        currentInterimTranscript = interimTranscript;
        const fullText = allFinalTranscript + currentInterimTranscript;

        if (field === 'principal') {
          setAudioCompleto(fullText);
        } else {
          setFormData(prev => ({ 
            ...prev, 
            [field]: fullText 
          }));
        }

        // Limpiar timeout de silencio si hay nueva entrada
        clearTimeout(silenceTimeoutRef.current);
        
        // Solo para el campo principal, establecer timeout de silencio de 6 segundos
        if (field === 'principal' && allFinalTranscript.length > 0) {
          silenceTimeoutRef.current = setTimeout(() => {
            if (isListening[field]) {
              console.log('⏰ Timeout de silencio alcanzado, procesando audio...');
              recognitionRef.current?.stop();
              setIsListening(prev => ({ ...prev, [field]: false }));
              if (allFinalTranscript.trim()) {
                procesarAudioConGPT(allFinalTranscript.trim());
              }
            }
          }, 6000); // Reducido a 6 segundos
        }
      };

      recognitionRef.current.onend = () => {
        console.log('🎤 Reconocimiento terminado');
        setIsListening(prev => ({ ...prev, [field]: false }));
        
        // Solo procesar si se detuvo manualmente y hay contenido
        if (field === 'principal' && allFinalTranscript.trim()) {
          procesarAudioConGPT(allFinalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.log('Error en reconocimiento:', event.error);
        
        // Manejar diferentes tipos de errores
        if (event.error === 'no-speech') {
          console.log('No se detectó habla, esperando...');
          return;
        }
        
        if (event.error === 'audio-capture') {
          console.log('Error de captura de audio');
          setIsListening(prev => ({ ...prev, [field]: false }));
          alert('Error de captura de audio. Por favor, verifica tu micrófono.');
          return;
        }
        
        if (event.error === 'not-allowed') {
          console.log('Permisos de micrófono denegados');
          setIsListening(prev => ({ ...prev, [field]: false }));
          alert('Por favor, permite el acceso al micrófono para usar esta función.');
          return;
        }

        // Para otros errores, parar completamente
        console.log('Error no recuperable:', event.error);
        setIsListening(prev => ({ ...prev, [field]: false }));
      };

      recognitionRef.current.start();
    } catch (error) {
      console.error('Error iniciando reconocimiento:', error);
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
        
        {/* Descripción Inteligente por Audio */}
        {voiceSupported && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card variant="subtle" className="max-w-2xl mx-auto">
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-medium text-white mb-4">
                  Descripción Inteligente
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-4">
                  Describe tu idea por audio y el sistema seleccionará automáticamente el área, objetivo y desafío
                </p>
                
                <Button
                  type="button"
                  onClick={() => toggleVoiceRecognition('principal')}
                  loading={procesandoAudio}
                  variant={isListening.principal ? 'danger' : 'primary'}
                  size="lg"
                  className="w-full text-sm sm:text-base mb-4"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  {isListening.principal 
                    ? 'Escuchando... (Toca para terminar y procesar)' 
                    : procesandoAudio 
                    ? 'Procesando con IA...' 
                    : 'Describir Idea Completa por Audio'
                  }
                </Button>

                {isListening.principal && (
                  <div className="mb-3">
                    <p className="text-xs sm:text-sm text-green-300 mb-2 p-2 bg-green-900/20 rounded border border-green-500/30">
                      🎤 Micrófono activo - Habla con naturalidad
                    </p>
                    <p className="text-xs text-slate-400">
                      💡 Tip: Describe tu idea completa, pausas son normales. Se procesará automáticamente tras 6 segundos de silencio.
                    </p>
                  </div>
                )}

                {audioCompleto && (
                  <div className="mb-4 p-3 bg-slate-700 rounded-lg text-left">
                    <p className="text-xs sm:text-sm text-slate-300 mb-1">Audio transcrito:</p>
                    <p className="text-xs sm:text-sm text-white">"{audioCompleto}"</p>
                  </div>
                )}
                
                {sugerenciasAutomaticas && (
                  <div className="p-4 bg-slate-700 rounded-lg border border-green-500/30 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-xs sm:text-sm text-green-300 font-medium">Análisis completado - Campos seleccionados automáticamente</p>
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <p><span className="text-slate-400">Área:</span> <span className="text-white font-medium">{areasNegocio.find(a => a.id === sugerenciasAutomaticas.areaNegocio)?.nombre || sugerenciasAutomaticas.areaNegocio}</span></p>
                      <p><span className="text-slate-400">Objetivo:</span> <span className="text-white font-medium">{sugerenciasAutomaticas.objetivo}</span></p>
                      <p><span className="text-slate-400">Desafío:</span> <span className="text-white font-medium">{sugerenciasAutomaticas.reto}</span></p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        type="button"
                        onClick={() => {
                          setSugerenciasAutomaticas(null);
                          setAudioCompleto('');
                          setFormData(prev => ({
                            ...prev,
                            areaNegocio: '',
                            objetivo: '',
                            reto: ''
                          }));
                        }}
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                      >
                        Limpiar y repetir
                      </Button>
                    </div>
                  </div>
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
              {areasNegocio.map((area) => {
                const isSelected = formData.areaNegocio === area.id;
                const isAutoSelected = sugerenciasAutomaticas && sugerenciasAutomaticas.areaNegocio === area.id;
                
                return (
                  <motion.button
                    key={area.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, areaNegocio: area.id }))}
                    className={`
                      p-3 sm:p-4 rounded-lg border transition-all duration-200 text-left min-h-[70px] sm:min-h-[auto] relative
                      ${isSelected
                        ? (isAutoSelected 
                          ? 'border-green-400 bg-green-900/20 text-white ring-2 ring-green-400/30' 
                          : 'border-slate-400 bg-slate-700 text-white')
                        : 'border-slate-600 hover:border-slate-500 bg-slate-800 text-slate-200'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isAutoSelected && isSelected && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                    <div className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2 sm:mb-3
                      ${isSelected
                        ? (isAutoSelected ? 'bg-green-700 text-white' : 'bg-slate-600 text-white')
                        : 'bg-slate-700 text-slate-300'
                      }
                    `}>
                      <area.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="text-xs sm:text-sm font-medium leading-tight">
                      {area.nombre}
                    </div>
                  </motion.button>
                );
              })}
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
