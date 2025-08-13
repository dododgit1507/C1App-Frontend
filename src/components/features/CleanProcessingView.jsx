// src/components/features/CleanProcessingView.jsx
import { motion } from 'framer-motion';
import { Settings, Edit, Search, Target, ArrowLeft } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const CleanProcessingView = ({ procesoActual, progreso, onBack }) => {
  // Debug para entender el progreso
  console.log('🔄 PROCESSING VIEW - Progreso recibido:', progreso);
  console.log('BarChart3 Agentes completados:', progreso.filter(p => p.estado === 'completado').length);
  console.log('Zap Agente actual procesando:', progreso.find(p => p.estado === 'procesando')?.fase);
  
  const agentes = [
    { 
      id: 'agente1', 
      name: 'Estructurador', 
      desc: 'Analizando estructura',
      step: '01',
      icon: Settings
    },
    { 
      id: 'agente2', 
      name: 'Prompteador', 
      desc: 'Creando prompt base',
      step: '02',
      icon: Edit
    },
    { 
      id: 'agente3', 
      name: 'Revisor', 
      desc: 'Revisando y mejorando',
      step: '03',
      icon: Search
    },
    { 
      id: 'agente4', 
      name: 'Implementador', 
      desc: 'Versión final',
      step: '04',
      icon: Target
    }
  ];

  const getAgentStatus = (agentId) => {
    // Buscar el progreso específico de este agente
    const agentProgress = progreso.find(p => p.fase === agentId);
    if (agentProgress) {
      if (agentProgress.estado === 'completado') {
        return 'completed';
      } else if (agentProgress.estado === 'procesando') {
        return 'processing';
      }
    }
    
    // Si no hay progreso registrado para este agente específico, determinar basado en el orden
    const agentIndex = agentes.findIndex(agent => agent.id === agentId);
    const completedAgents = progreso.filter(p => p.estado === 'completado').length;
    
    if (completedAgents > agentIndex) {
      return 'completed';
    } else if (completedAgents === agentIndex) {
      // Verificar si el agente actual está procesando
      const currentProcessing = progreso.find(p => p.estado === 'procesando');
      if (currentProcessing && currentProcessing.fase === agentId) {
        return 'processing';
      }
    }
    
    return 'pending';
  };

  const getCurrentAgent = () => {
    // Buscar el último agente que está procesando o el primero que está pendiente
    const processingAgent = progreso.find(p => p.estado === 'procesando');
    if (processingAgent) {
      return processingAgent.fase;
    }
    
    // Si no hay agente procesando, calcular basado en agentes completados
    const completedCount = progreso.filter(p => p.estado === 'completado').length;
    if (completedCount < agentes.length) {
      return agentes[completedCount].id;
    }
    
    return 'agente4'; // Por defecto el último
  };

  const currentAgent = getCurrentAgent();
  
  // Calcular progreso más preciso basado en agentes completados + progreso del actual
  const completedAgents = progreso.filter(p => p.estado === 'completado').length;
  const processingAgent = progreso.find(p => p.estado === 'procesando');
  let overallProgress = (completedAgents / agentes.length) * 100;
  
  // Si hay un agente procesando, agregar progreso parcial
  if (processingAgent && completedAgents < agentes.length) {
    overallProgress += (1 / agentes.length) * 50; // Agregar 50% del agente actual
  }

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4">
      
      {/* Header minimalista */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-4">
          Procesando Prompt
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mb-6 sm:mb-8">
          Nuestros agentes especializados están optimizando tu consulta
        </p>
        
        {/* Progress bar minimalista */}
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between text-xs sm:text-sm text-slate-400 mb-2">
            <span>Progreso</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5">
            <motion.div
              className="h-full bg-slate-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Agentes en línea minimalista */}
      <Card className="mb-8">
        <div className="space-y-6">
          {agentes.map((agente, index) => {
            const status = getAgentStatus(agente.id);
            const isCurrentAgent = currentAgent === agente.id;
            
            return (
              <motion.div
                key={agente.id}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Step number */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                  ${status === 'completed' 
                    ? 'bg-slate-600 text-white' 
                    : status === 'processing'
                    ? 'bg-slate-700 text-slate-200 animate-pulse'
                    : 'bg-slate-800 text-slate-500'
                  }
                `}>
                  {status === 'completed' ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : status === 'processing' ? (
                    <agente.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <agente.icon className="w-4 h-4 sm:w-5 sm:h-5 opacity-50" />
                  )}
                </div>

                {/* Agent info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium transition-colors ${
                      status === 'completed' || status === 'processing' 
                        ? 'text-white' 
                        : 'text-slate-500'
                    }`}>
                      {agente.name}
                    </h3>
                    
                    {/* Status indicator */}
                    {status === 'processing' && (
                      <motion.div
                        className="flex items-center gap-2 text-sm text-slate-400"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                        Procesando...
                      </motion.div>
                    )}
                    
                    {status === 'completed' && (
                      <span className="text-sm text-slate-400">
                        Completado
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-sm transition-colors ${
                    status === 'completed' || status === 'processing' 
                      ? 'text-slate-300' 
                      : 'text-slate-500'
                  }`}>
                    {agente.desc}
                  </p>
                </div>

                {/* Connection line */}
                {index < agentes.length - 1 && (
                  <div className="absolute left-5 mt-10 w-0.5 h-6 bg-slate-700" />
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Current process info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card variant="subtle" className="text-center">
          <p className="text-slate-400 text-sm">
            {procesoActual || 'Iniciando procesamiento...'}
          </p>
        </Card>
      </motion.div>

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-8"
      >
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-slate-400 hover:text-slate-200 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al formulario
        </Button>
      </motion.div>

    </div>
  );
};

export default CleanProcessingView;
