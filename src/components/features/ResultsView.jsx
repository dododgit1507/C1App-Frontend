// src/components/features/ResultsView.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowLeft, 
  Trophy, 
  CheckCircle, 
  Copy, 
  Settings,
  Edit,
  Search,
  Target,
  ClipboardList,
  Key,
  BarChart3,
  Lightbulb,
  Rocket,
  Sparkles,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ResultsView = ({ resultado, onNewPrompt }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const promptFinalRef = useRef(null);

  // Auto scroll al prompt final cuando se muestren los resultados
  useEffect(() => {
    if (resultado && resultado.exito && promptFinalRef.current) {
      setTimeout(() => {
        promptFinalRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 1000); // Esperar 1 segundo para que se complete la animación
    }
  }, [resultado]);

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  console.log('Target RESULTADO EN RESULTSVIEW:', resultado);
  console.log('ClipboardList ANÁLISIS COMPLETO ESTRUCTURA:', resultado?.analisisCompleto);
  if (resultado?.analisisCompleto) {
    console.log('Settings AGENTE 1 DATA:', resultado.analisisCompleto.agente1);
    console.log('Edit AGENTE 2 DATA:', resultado.analisisCompleto.agente2);
    console.log('Search AGENTE 3 DATA:', resultado.analisisCompleto.agente3);
    console.log('Target AGENTE 4 DATA:', resultado.analisisCompleto.agente4);
  }

  if (!resultado || !resultado.exito) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Error en el Procesamiento</h2>
            <p className="text-slate-400 mb-6">
              {resultado?.detalleError || 'Ha ocurrido un error inesperado'}
            </p>
            <Button onClick={onNewPrompt} variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Intentar de nuevo
            </Button>
          </motion.div>
        </Card>
      </div>
    );
  }

  // Función auxiliar para extraer datos de agentes de diferentes estructuras posibles
  const extractAgentData = (resultado) => {
    // La estructura real que viene del backend según los logs
    const analisisCompleto = resultado?.analisisCompleto;
    
    const agentData = {
      agente1: analisisCompleto?.estructura,      // Agente Estructurador
      agente2: analisisCompleto?.promptCreado,    // Agente Prompteador  
      agente3: analisisCompleto?.revision,        // Agente Revisor
      agente4: analisisCompleto?.implementacion   // Agente Implementador
    };

    console.log('Search DATOS EXTRAÍDOS DE AGENTES:', agentData);
    console.log('Settings AGENTE 1 (estructura):', agentData.agente1);
    console.log('Edit AGENTE 2 (promptCreado):', agentData.agente2);
    console.log('Search AGENTE 3 (revision):', agentData.agente3);
    console.log('Target AGENTE 4 (implementacion):', agentData.agente4);
    
    return agentData;
  };

  const agentData = extractAgentData(resultado);

  // Estructura adaptada a la respuesta real del backend
  const agentResults = [
    {
      name: 'Agente Estructurador',
      icon: Settings,
      color: 'from-slate-600 to-slate-700',
      data: agentData.agente1,
      sections: [
        { key: 'estructura_recomendada', title: 'Estructura Recomendada', icon: ClipboardList },
        { key: 'elementos_clave', title: 'Elementos Clave', icon: Key },
        { key: 'complejidad', title: 'Complejidad', icon: BarChart3 },
        { key: 'analisis', title: 'Análisis', icon: Search }
      ]
    },
    {
      name: 'Agente Prompteador',
      icon: Edit,
      color: 'from-slate-700 to-slate-800',
      data: agentData.agente2,
      sections: [
        { key: 'prompt_optimizado', title: 'Prompt Optimizado', icon: Sparkles },
        { key: 'efectividad_estimada', title: 'Efectividad Estimada', icon: Trophy },
        { key: 'tokens_estimados', title: 'Tokens Estimados', icon: BarChart3 }
      ]
    },
    {
      name: 'Agente Revisor',
      icon: Search,
      color: 'from-slate-600 to-slate-700',
      data: agentData.agente3,
      sections: [
        { key: 'puntuacion_total', title: 'Puntuación Total', icon: Trophy },
        { key: 'evaluacion', title: 'Evaluación', icon: BarChart3 },
        { key: 'mejoras_aplicadas', title: 'Mejoras Aplicadas', icon: Rocket },
        { key: 'mejoras_sugeridas', title: 'Mejoras Sugeridas', icon: Lightbulb }
      ]
    },
    {
      name: 'Agente Implementador - RESULTADO FINAL',
      icon: Target,
      color: 'from-slate-700 to-slate-800',
      data: agentData.agente4,
      finalPrompt: resultado.promptFinal,
      sections: [
        { key: 'prompt_final', title: 'Prompt Final Optimizado', icon: Trophy },
        { key: 'puntuacion_final', title: 'Puntuación Final', icon: Trophy },
        { key: 'mejoras_implementadas', title: 'Mejoras Implementadas', icon: Sparkles }
      ]
    }
  ];

  const renderSectionContent = (content, icon) => {
    if (!content) return <div className="text-slate-400">No disponible</div>;
    
    if (typeof content === 'string') {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            {icon && <icon className="w-4 h-4 text-slate-400" />}
          </div>
          <p className="text-slate-300 leading-relaxed">{content}</p>
        </div>
      );
    }
    
    if (typeof content === 'object') {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            {icon && <icon className="w-4 h-4 text-slate-400" />}
          </div>
          <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      );
    }
    
    return <div className="text-slate-400">Formato no soportado</div>;
  };

  const ActionButton = ({ onClick, icon: IconComponent, label, variant = 'secondary' }) => (
    <Button onClick={onClick} variant={variant} className="flex items-center gap-2">
      <IconComponent className="w-4 h-4" />
      {label}
    </Button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header de éxito */}
      <Card className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-green-400 mb-4">¡Optimización Completada!</h2>
          <p className="text-slate-400 mb-6">
            Tu prompt ha sido analizado y optimizado por nuestros 4 agentes especializados
          </p>
          <Button onClick={onNewPrompt} variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Crear nuevo prompt
          </Button>
        </motion.div>
      </Card>

      {/* Prompt Final Destacado */}
      {resultado.promptFinal && (
        <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30" ref={promptFinalRef}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                <Trophy className="w-5 h-5 mr-2 inline" />
                Prompt Final Listo
              </h3>
            </div>
            <ActionButton
              onClick={() => copyToClipboard(resultado.promptFinal, 'final')}
              icon={copiedIndex === 'final' ? CheckCircle : Copy}
              label={copiedIndex === 'final' ? 'Copiado!' : 'Copiar'}
              variant="primary"
            />
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
              {resultado.promptFinal}
            </p>
          </div>
        </Card>
      )}

      {/* Resultados por Agente */}
      <div className="space-y-4">
        {agentResults.map((agent, agentIndex) => {
          if (!agent.data && !agent.finalPrompt) {
            return null; // No mostrar agentes sin datos
          }

          const AgentIcon = agent.icon;

          return (
            <Card key={agentIndex} className={`bg-gradient-to-r ${agent.color}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <AgentIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
              </div>

              {/* Renderizar prompt final si existe */}
              {agent.finalPrompt && (
                <div className="mb-4 p-4 bg-black/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-200">PROMPT FINAL OPTIMIZADO</span>
                    </div>
                    <ActionButton
                      onClick={() => copyToClipboard(agent.finalPrompt, `agent-${agentIndex}-final`)}
                      icon={copiedIndex === `agent-${agentIndex}-final` ? CheckCircle : Copy}
                      label={copiedIndex === `agent-${agentIndex}-final` ? 'Copiado!' : 'Copiar'}
                    />
                  </div>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {agent.finalPrompt}
                  </p>
                </div>
              )}

              {/* Secciones del agente */}
              {agent.sections && agent.sections.length > 0 && (
                <div className="space-y-3">
                  {agent.sections.map((section, sectionIndex) => {
                    const sectionId = `${agentIndex}-${sectionIndex}`;
                    const isExpanded = expandedSection === sectionId;
                    const sectionData = agent.data?.[section.key];
                    
                    if (!sectionData) return null;

                    const SectionIcon = section.icon;

                    return (
                      <div key={sectionIndex} className="bg-white/5 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedSection(isExpanded ? null : sectionId)}
                          className="w-full p-3 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <SectionIcon className="w-4 h-4 text-slate-300" />
                            <span className="text-white font-medium">{section.title}</span>
                          </div>
                          {isExpanded ? 
                            <ChevronDown className="w-4 h-4 text-slate-300" /> : 
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                          }
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 border-t border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-slate-400">Contenido:</span>
                                  <ActionButton
                                    onClick={() => copyToClipboard(
                                      typeof sectionData === 'string' ? sectionData : JSON.stringify(sectionData, null, 2), 
                                      sectionId
                                    )}
                                    icon={copiedIndex === sectionId ? CheckCircle : Copy}
                                    label={copiedIndex === sectionId ? 'Copiado!' : 'Copiar'}
                                  />
                                </div>
                                {renderSectionContent(sectionData, SectionIcon)}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Resumen Final */}
      <Card className="text-center">
        <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Resumen del Procesamiento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {agentResults.map((agent, index) => {
            const AgentIcon = agent.icon;
            return (
              <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AgentIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">{agent.name.split(' ')[1]}</span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {agent.data ? <CheckCircle className="w-6 h-6 mx-auto" /> : <X className="w-6 h-6 mx-auto text-red-400" />}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-6 border border-green-500/30">
          <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
            <Rocket className="w-5 h-5" />
            ¿Te gustó el resultado?
          </h3>
          <p className="text-slate-400 mb-4">
            Comparte tu experiencia o crea un nuevo prompt optimizado
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onNewPrompt} variant="primary">
              <Sparkles className="w-4 h-4 mr-2" />
              Crear Nuevo Prompt
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultsView;
