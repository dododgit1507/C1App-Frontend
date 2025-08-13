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

  // Auto-analysis state
  const [analizandoTexto, setAnalizandoTexto] = useState(false);
  const [textoCompleto, setTextoCompleto] = useState('');
  const [sugerenciasAutomaticas, setSugerenciasAutomaticas] = useState({
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
      setFormData(resultado);
      setAudioCompleto('');
    } catch (error) {
      console.error('Error procesando audio:', error);
    } finally {
      setProcesandoAudio(false);
    }
  };

  // Smart text analysis function
  const analizarTextoInteligente = async (texto) => {
    if (!texto || texto.trim().length < 10) {
      alert('Por favor, escribe al menos 10 caracteres para poder analizar tu idea.');
      return;
    }
    
    setAnalizandoTexto(true);
    try {
      // Análisis local por palabras clave
      const analisisLocal = analizarTextoLocal(texto);
      
      // Intentar análisis con IA como backup
      let analisisIA = null;
      try {
        analisisIA = await apiClient.interpretarVoz(texto);
      } catch (error) {
        console.log('Usando análisis local como fallback');
      }
      
      // Combinar resultados (priorizar IA si está disponible)
      const resultado = analisisIA || analisisLocal;
      
      // Validar área de negocio
      const areasValidas = ['marketing', 'programacion', 'finanzas', 'recursos-humanos', 'atencion-cliente', 'educacion', 'salud', 'creatividad'];
      if (!areasValidas.includes(resultado.areaNegocio)) {
        resultado.areaNegocio = analisisLocal.areaNegocio;
      }
      
      setSugerenciasAutomaticas(resultado);
      setFormData(prev => ({
        ...prev,
        areaNegocio: resultado.areaNegocio,
        objetivo: resultado.objetivo,
        reto: resultado.reto
      }));
      
      // Mostrar notificación de éxito
      console.log('✅ Análisis completado. Los campos se han rellenado automáticamente.');
      
    } catch (error) {
      console.error('Error analizando texto:', error);
      // Fallback al análisis local
      const analisisLocal = analizarTextoLocal(texto);
      setSugerenciasAutomaticas(analisisLocal);
      setFormData(prev => ({
        ...prev,
        areaNegocio: analisisLocal.areaNegocio,
        objetivo: analisisLocal.objetivo,
        reto: analisisLocal.reto
      }));
      console.log('⚠️ Usando análisis básico. Los campos se han rellenado automáticamente.');
    } finally {
      setAnalizandoTexto(false);
    }
  };

  // Local text analysis using keywords
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
        
        {/* Smart Text Analysis */}
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
                Describe tu idea y el sistema elegirá automáticamente el área, objetivo y reto
              </p>
              
              <CleanTextarea
                value={textoCompleto}
                onChange={(value) => setTextoCompleto(value)}
                placeholder="Describe tu idea completa aquí... Ejemplo: 'Necesito crear una campaña de marketing para aumentar las ventas de mi producto pero tengo poco presupuesto'"
                rows={4}
                maxLength={1000}
                className="mb-4"
              />
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => analizarTextoInteligente(textoCompleto)}
                  loading={analizandoTexto}
                  variant="primary"
                  size="lg"
                  className="flex-1 text-sm sm:text-base"
                  disabled={!textoCompleto || textoCompleto.trim().length < 10}
                >
                  {analizandoTexto 
                    ? 'Analizando...' 
                    : 'Describir Idea Completa'
                  }
                </Button>
                
                {sugerenciasAutomaticas && (
                  <Button
                    type="button"
                    onClick={() => {
                      setSugerenciasAutomaticas(null);
                      setTextoCompleto('');
                      setFormData(prev => ({
                        ...prev,
                        areaNegocio: '',
                        objetivo: '',
                        reto: ''
                      }));
                    }}
                    variant="secondary"
                    size="lg"
                    className="text-sm sm:text-base"
                  >
                    Limpiar
                  </Button>
                )}
              </div>
              
              {sugerenciasAutomaticas && (
                <div className="mt-4 p-4 bg-slate-700 rounded-lg border border-green-500/30 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs sm:text-sm text-green-300 font-medium">Análisis completado - Campos rellenados automáticamente</p>
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p><span className="text-slate-400">Área:</span> <span className="text-white font-medium">{areasNegocio.find(a => a.id === sugerenciasAutomaticas.areaNegocio)?.nombre || sugerenciasAutomaticas.areaNegocio}</span></p>
                    <p><span className="text-slate-400">Objetivo:</span> <span className="text-white font-medium">{sugerenciasAutomaticas.objetivo}</span></p>
                    <p><span className="text-slate-400">Reto:</span> <span className="text-white font-medium">{sugerenciasAutomaticas.reto}</span></p>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Puedes modificar cualquier campo manualmente si lo necesitas</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

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
                  Entrada por Voz (Alternativa)
                </h3>
                <Button
                  type="button"
                  onClick={() => toggleVoiceRecognition('principal')}
                  loading={procesandoAudio}
                  variant={isListening.principal ? 'danger' : 'secondary'}
                  size="lg"
                  className="w-full text-sm sm:text-base"
                >
                  {isListening.principal 
                    ? 'Grabando... (Toca para parar)' 
                    : procesandoAudio 
                    ? 'Procesando...' 
                    : 'Usar Voz en su lugar'
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
