// src/components/layout/TabNavigation.jsx
import { motion } from 'framer-motion';
import { Zap, Settings, ClipboardList } from 'lucide-react';

const TabNavigation = ({ currentView, onViewChange, loading }) => {
  const tabs = [
    {
      id: 'formulario',
      label: 'Crear Prompt',
      icon: Zap,
      description: 'Diseña tu consulta'
    },
    {
      id: 'procesando',
      label: 'Procesando',
      icon: Settings,
      description: 'IA trabajando'
    },
    {
      id: 'resultados',
      label: 'Resultados',
      icon: ClipboardList,
      description: 'Tu prompt optimizado'
    }
  ];

  return (
    <div className="mb-6 sm:mb-8 px-2">
      <nav className="flex justify-center">
        <div className="inline-flex bg-slate-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 shadow-lg border border-slate-700 w-full max-w-2xl overflow-x-auto">
          {tabs.map((tab, index) => {
            const isActive = currentView === tab.id;
            const isCompleted = 
              (tab.id === 'formulario') || 
              (tab.id === 'procesando' && (currentView === 'resultados' || currentView === 'procesando')) ||
              (tab.id === 'resultados' && currentView === 'resultados');

            return (
              <motion.button
                key={tab.id}
                onClick={() => !loading && tab.id !== 'procesando' && onViewChange(tab.id)}
                disabled={loading || tab.id === 'procesando'}
                className={`
                  relative px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-300
                  flex items-center gap-2 sm:gap-3 min-w-[100px] sm:min-w-[140px] justify-center flex-1
                  ${isActive 
                    ? 'text-white shadow-lg' 
                    : isCompleted 
                      ? 'text-slate-300 hover:text-white' 
                      : 'text-slate-500'
                  }
                  ${!loading && tab.id !== 'procesando' ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                `}
                whileHover={!loading && tab.id !== 'procesando' ? { scale: 1.02 } : {}}
                whileTap={!loading && tab.id !== 'procesando' ? { scale: 0.98 } : {}}
              >
                {/* Background activo */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-slate-700 rounded-lg sm:rounded-xl"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Contenido del tab */}
                <div className="relative z-10 flex items-center gap-1 sm:gap-2">
                  <motion.div
                    animate={currentView === 'procesando' && tab.id === 'procesando' ? {
                      rotate: [0, 360],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: currentView === 'procesando' && tab.id === 'procesando' ? Infinity : 0,
                      ease: "linear"
                    }}
                  >
                    <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                  <div className="text-left hidden sm:block">
                    <div className="font-semibold">{tab.label}</div>
                    <div className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                      {tab.description}
                    </div>
                  </div>
                  <div className="text-center sm:hidden">
                    <div className="font-semibold text-xs">{tab.label}</div>
                  </div>
                </div>

                {/* Indicador de completado */}
                {isCompleted && !isActive && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-slate-500 rounded-full border-2 border-slate-800"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Línea de progreso */}
      <div className="mt-4 sm:mt-6 max-w-md mx-auto">
        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-slate-500"
            initial={{ width: "0%" }}
            animate={{ 
              width: currentView === 'formulario' ? "33%" : 
                     currentView === 'procesando' ? "66%" : 
                     "100%" 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
