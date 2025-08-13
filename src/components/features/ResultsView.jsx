// src/components/features/ResultsView.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  console.log('🎯 RESULTADO EN RESULTSVIEW:', resultado);
  console.log('📋 ANÁLISIS COMPLETO ESTRUCTURA:', resultado?.analisisCompleto);
  if (resultado?.analisisCompleto) {
    console.log('🔧 AGENTE 1 DATA:', resultado.analisisCompleto.agente1);
    console.log('✍️ AGENTE 2 DATA:', resultado.analisisCompleto.agente2);
    console.log('🔍 AGENTE 3 DATA:', resultado.analisisCompleto.agente3);
    console.log('🎯 AGENTE 4 DATA:', resultado.analisisCompleto.agente4);
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
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Error en el Procesamiento</h2>
            <p className="text-slate-400 mb-6">
              {resultado?.detalleError || 'Ha ocurrido un error inesperado'}
            </p>
            <Button onClick={onNewPrompt} variant="primary">
              ← Intentar de nuevo
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

    console.log('🔍 DATOS EXTRAÍDOS DE AGENTES:', agentData);
    console.log('🔧 AGENTE 1 (estructura):', agentData.agente1);
    console.log('✍️ AGENTE 2 (promptCreado):', agentData.agente2);
    console.log('🔍 AGENTE 3 (revision):', agentData.agente3);
    console.log('🎯 AGENTE 4 (implementacion):', agentData.agente4);
    
    return agentData;
  };

  const agentData = extractAgentData(resultado);

  // Estructura adaptada a la respuesta real del backend
  const agentResults = [
    {
      name: 'Agente Estructurador',
      icon: '🔧',
      color: 'from-slate-600 to-slate-700',
      data: agentData.agente1,
      sections: [
        { key: 'estructura_recomendada', title: 'Estructura Recomendada', icon: '📋' },
        { key: 'elementos_clave', title: 'Elementos Clave', icon: '🔑' },
        { key: 'complejidad', title: 'Complejidad', icon: '📊' },
        { key: 'analisis', title: 'Análisis', icon: '🔍' }
      ]
    },
    {
      name: 'Agente Prompteador',
      icon: '✍️',
      color: 'from-slate-700 to-slate-800',
      data: agentData.agente2,
      sections: [
        { key: 'prompt_optimizado', title: 'Prompt Optimizado', icon: '💎' },
        { key: 'efectividad_estimada', title: 'Efectividad Estimada', icon: '⭐' },
        { key: 'tokens_estimados', title: 'Tokens Estimados', icon: '�' }
      ]
    },
    {
      name: 'Agente Revisor',
      icon: '🔍',
      color: 'from-slate-600 to-slate-700',
      data: agentData.agente3,
      sections: [
        { key: 'puntuacion_total', title: 'Puntuación Total', icon: '📈' },
        { key: 'evaluacion', title: 'Evaluación', icon: '📊' },
        { key: 'mejoras_aplicadas', title: 'Mejoras Aplicadas', icon: '🚀' },
        { key: 'mejoras_sugeridas', title: 'Mejoras Sugeridas', icon: '�' }
      ]
    },
    {
      name: 'Agente Implementador - RESULTADO FINAL',
      icon: '🎯',
      color: 'from-slate-700 to-slate-800',
      data: agentData.agente4,
      finalPrompt: resultado.promptFinal,
      sections: [
        { key: 'prompt_final', title: 'Prompt Final Optimizado', icon: '🏆' },
        { key: 'puntuacion_final', title: 'Puntuación Final', icon: '⭐' },
        { key: 'mejoras_implementadas', title: 'Mejoras Implementadas', icon: '⚡' }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0">
      
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <motion.div
            className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          >
            <span className="text-xl sm:text-3xl">🎉</span>
          </motion.div>
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">¡Prompt Optimizado!</h2>
            <p className="text-xs sm:text-sm text-slate-400">Tu prompt ha sido procesado por nuestros 4 agentes especializados</p>
          </div>
        </div>
        
        <Button onClick={onNewPrompt} variant="outline" size="lg" className="w-full sm:w-auto">
          ← Crear nuevo prompt
        </Button>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        ref={promptFinalRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-slate-800 border-slate-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-white">🏆 Prompt Final Listo</h3>
              <p className="text-slate-400">Copia el prompt optimizado y úsalo directamente</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => copyToClipboard(resultado.promptFinal || '', 'final')}
                variant={copiedIndex === 'final' ? 'success' : 'primary'}
                icon={copiedIndex === 'final' ? '✅' : '📋'}
              >
                {copiedIndex === 'final' ? 'Copiado!' : 'Copiar Prompt'}
              </Button>
              <Button
                onClick={() => setExpandedSection(expandedSection === 'final' ? null : 'final')}
                variant="outline"
                icon={expandedSection === 'final' ? '�' : '🔽'}
              >
                {expandedSection === 'final' ? 'Ocultar' : 'Ocultar'}
              </Button>
            </div>
          </div>
          
          {/* Prompt Final siempre visible */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-600"
          >
            <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono">
              {resultado.promptFinal}
            </pre>
          </motion.div>
        </Card>
      </motion.div>

      {/* Results by Agent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agentResults.map((agent, agentIndex) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + agentIndex * 0.1 }}
          >
            <Card hover>
              {/* Agent Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-white text-xl`}>
                  {agent.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                  <p className="text-sm text-slate-400">Análisis completado</p>
                </div>
              </div>

              {/* Agent Results */}
              <div className="space-y-4">
                {agent.sections.map((section, sectionIndex) => {
                  const sectionId = `${agentIndex}-${sectionIndex}`;
                  const isExpanded = expandedSection === sectionId;
                  
                  // Manejo especial para el prompt final del agente 4
                  let content;
                  if (agent.name.includes('Implementador') && section.key === 'prompt_final') {
                    content = agent.finalPrompt; // Usar el prompt final completo
                  } else {
                    content = agent.data?.[section.key];
                  }
                  
                  if (!content) return null;

                  return (
                    <div key={section.key} className="border-l-4 border-slate-600 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{section.icon}</span>
                          <h4 className="font-semibold text-white">{section.title}</h4>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(
                              typeof content === 'object' ? JSON.stringify(content, null, 2) : content,
                              sectionId
                            )}
                            icon={copiedIndex === sectionId ? '✅' : '📋'}
                          >
                            {copiedIndex === sectionId ? 'Copiado' : 'Copiar'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setExpandedSection(isExpanded ? null : sectionId)}
                            icon={isExpanded ? '🔼' : '🔽'}
                          >
                            {isExpanded ? 'Menos' : 'Más'}
                          </Button>
                        </div>
                      </div>
                      
                      <div className={`text-sm text-slate-300 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                        {typeof content === 'object' ? (
                          <div className="space-y-2">
                            {Array.isArray(content) ? (
                              <ul className="list-disc list-inside space-y-1">
                                {content.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              Object.entries(content).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium text-white">{key}:</span>{' '}
                                  {typeof value === 'object' ? (
                                    Array.isArray(value) ? (
                                      <ul className="list-disc list-inside ml-4 mt-1">
                                        {value.map((item, idx) => (
                                          <li key={idx}>{typeof item === 'object' ? JSON.stringify(item, null, 2) : item}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <pre className="text-xs bg-slate-800 border border-slate-600 text-slate-300 p-3 rounded-lg mt-1 overflow-x-auto font-mono">
                                        {JSON.stringify(value, null, 2)}
                                      </pre>
                                    )
                                  ) : (
                                    value
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        ) : (
                          // Manejo especial para el prompt final - mostrar en un contenedor especial
                          agent.name.includes('Implementador') && section.key === 'prompt_final' ? (
                            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-4 border-2 border-slate-600">
                              <div className="text-xs text-slate-300 font-medium mb-2">🏆 PROMPT FINAL OPTIMIZADO</div>
                              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-200">{content}</pre>
                            </div>
                          ) : (
                            <p className="leading-relaxed">{content}</p>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Card className="bg-slate-800 border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 text-center">
            📊 Resumen del Procesamiento
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-300">4</div>
              <div className="text-sm text-slate-400">Agentes IA Utilizados</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-300">
                {resultado.resumen?.puntuacion_final || resultado.analisisCompleto?.agente4?.puntuacion_final || 'N/A'}
              </div>
              <div className="text-sm text-slate-400">Puntuación Final</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-300">
                {resultado.promptFinal?.length || 0}
              </div>
              <div className="text-sm text-slate-400">Caracteres en Prompt</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <Card className="bg-slate-800 border-slate-700 text-white">
          <h3 className="text-xl font-bold mb-2">🚀 ¿Te gustó el resultado?</h3>
          <p className="text-slate-300 mb-4">
            Crea otro prompt optimizado para diferentes objetivos empresariales
          </p>
          <Button onClick={onNewPrompt} variant="secondary" size="lg">
            Crear Otro Prompt
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResultsView;
