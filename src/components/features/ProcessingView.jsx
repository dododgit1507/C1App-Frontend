// src/components/features/ProcessingView.jsx
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ProcessingView = ({ procesoActual, progreso, onBack }) => {
  const agentes = [
    { 
      id: 'agente1', 
      name: 'Agente Estructurador', 
      icon: '⚙️', 
      desc: 'Analizando estructura óptima',
      color: 'from-slate-600 to-gray-700'
    },
    { 
      id: 'agente2', 
      name: 'Agente Prompteador', 
      icon: '📝', 
      desc: 'Creando prompt base',
      color: 'from-gray-600 to-slate-700'
    },
    { 
      id: 'agente3', 
      name: 'Agente Revisor', 
      icon: '🔍', 
      desc: 'Revisando y mejorando',
      color: 'from-slate-700 to-gray-800'
    },
    { 
      id: 'agente4', 
      name: 'Agente Implementador', 
      icon: '📋', 
      desc: 'Generando versión final',
      color: 'from-gray-700 to-slate-800'
    }
  ];

  const getAgentStatus = (agentId) => {
    const agentProgress = progreso.find(p => p.fase === agentId);
    if (agentProgress) {
      return agentProgress.estado === 'completado' ? 'completed' : 'processing';
    }
    return 'pending';
  };

  const getCurrentAgent = () => {
    const lastProgress = progreso[progreso.length - 1];
    if (lastProgress) {
      return lastProgress.fase;
    }
    return 'agente1';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-slate-600 to-gray-700 rounded-2xl flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <span className="text-3xl">⚡</span>
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Procesando con IA</h2>
            <p className="text-gray-600">Nuestros 4 agentes especializados están optimizando tu prompt</p>
          </div>
        </div>
        
        <Button variant="ghost" onClick={onBack}>
          ← Volver al formulario
        </Button>
      </motion.div>

      {/* Current Process */}
      <Card className="text-center">
        <motion.div
          key={procesoActual}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Estado Actual</h3>
          <p className="text-lg text-blue-600">{procesoActual}</p>
        </motion.div>
      </Card>

      {/* Agents Progress */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Progreso de los Agentes IA</h3>
        
        <div className="space-y-6">
          {agentes.map((agente, index) => {
            const status = getAgentStatus(agente.id);
            const isCurrentAgent = getCurrentAgent() === agente.id;
            
            return (
              <motion.div
                key={agente.id}
                className={`
                  flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-500
                  ${status === 'completed' 
                    ? 'border-green-200 bg-green-50' 
                    : isCurrentAgent 
                      ? 'border-blue-300 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 bg-gray-50'
                  }
                `}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Agent Icon */}
                <motion.div
                  className={`
                    w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl
                    bg-gradient-to-br ${agente.color}
                    ${status === 'completed' ? 'bg-gradient-to-br from-slate-500 to-gray-600' : ''}
                  `}
                  animate={isCurrentAgent ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: isCurrentAgent ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  {status === 'completed' ? '✅' : agente.icon}
                </motion.div>

                {/* Agent Info */}
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{agente.name}</h4>
                  <p className="text-gray-600">{agente.desc}</p>
                </div>

                {/* Status Indicator */}
                <div className="text-right">
                  {status === 'completed' && (
                    <motion.div
                      className="text-green-600 font-semibold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      ✓ Completado
                    </motion.div>
                  )}
                  {isCurrentAgent && status !== 'completed' && (
                    <motion.div
                      className="text-slate-600 font-semibold flex items-center gap-2"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <motion.div
                        className="w-3 h-3 bg-slate-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      Procesando...
                    </motion.div>
                  )}
                  {status === 'pending' && !isCurrentAgent && (
                    <div className="text-gray-400 font-medium">
                      Esperando...
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso general</span>
            <span>{Math.round((progreso.length / agentes.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-slate-600 to-gray-700"
              initial={{ width: "0%" }}
              animate={{ width: `${(progreso.length / agentes.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </Card>

      {/* Fun Facts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-slate-50 to-gray-100 border-slate-200">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">
              � Información del proceso
            </h4>
            <motion.p
              className="text-indigo-600"
              key={Math.floor(Date.now() / 5000)} // Change every 5 seconds
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {[
                "Cada agente utiliza una estrategia diferente de procesamiento para optimizar tu prompt.",
                "El sistema analiza más de 50 factores para determinar la mejor estructura.",
                "Los prompts optimizados pueden mejorar la calidad de respuesta hasta en un 300%.",
                "Nuestros agentes han sido entrenados con miles de prompts exitosos.",
                "El análisis incluye factores como tono, contexto y objetivo específico."
              ][Math.floor(Date.now() / 5000) % 5]}
            </motion.p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProcessingView;
