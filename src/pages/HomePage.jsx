// src/pages/HomePage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Layout components
import MainLayout from '../components/layout/MainLayout';
import Header from '../components/layout/Header';
import TabNavigation from '../components/layout/TabNavigation';

// Feature components
import CleanPromptForm from '../components/forms/CleanPromptForm';
import CleanProcessingView from '../components/features/CleanProcessingView';
import ResultsView from '../components/features/ResultsView';

// Services
import { apiClient } from '../services/apiClient';

const HomePage = () => {
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [procesoActual, setProcesoActual] = useState('');
  const [progreso, setProgreso] = useState([]);
  const [vistaActual, setVistaActual] = useState('formulario'); // 'formulario', 'procesando', 'resultados'

  const handleFormSubmit = async (formData) => {
    console.log('📋 Datos recibidos del formulario:', formData);
    
    setLoading(true);
    setResultado(null);
    setProgreso([]);
    setVistaActual('procesando');
    setProcesoActual('🌐 Conectando con el backend...');
    
    try {
      // Verificar conexión con el backend primero
      const backendConectado = await apiClient.verificarConexion();
      if (!backendConectado) {
        throw new Error('❌ No se pudo conectar con el backend. Asegúrate de que esté ejecutándose en http://localhost:3001');
      }

      setProcesoActual('✅ Conectado al backend. Procesando con agentes IA...');

      // Procesar con agentes IA a través del backend
      const resultado = await apiClient.procesarSolicitudCompleta(
        formData.areaNegocio, // especialidad -> areaNegocio
        formData.modelo, 
        `OBJETIVO: ${formData.objetivo}\n${formData.reto ? `RETO ESPECÍFICO: ${formData.reto}` : ''}`, // Formatear consulta
        (progresoInfo) => {
          setProcesoActual(progresoInfo.mensaje);
          setProgreso(prev => [...prev, progresoInfo]);
        },
        null // modeloInfo ya no se usa
      );

      console.log('🎯 RESULTADO RECIBIDO EN FRONTEND:', resultado);

      // Esperar un momento antes de mostrar resultados para que se vea el progreso completo
      await new Promise(resolve => setTimeout(resolve, 500));

      setResultado(resultado);
      setVistaActual('resultados');
      
      // Auto scroll a los resultados
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Error:', error);
      setResultado({
        exito: false,
        error: 'Error al procesar la solicitud con IA',
        detalleError: error.message
      });
      setVistaActual('resultados');
    } finally {
      setLoading(false);
      setProcesoActual('');
    }
  };

  const handleViewChange = (newView) => {
    if (newView === 'formulario') {
      setVistaActual('formulario');
      setResultado(null);
      setProgreso([]);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 max-w-7xl">
        
        {/* Header */}
        <Header />
        
        {/* Navigation */}
        <TabNavigation 
          currentView={vistaActual}
          onViewChange={handleViewChange}
          loading={loading}
        />

        {/* Main Content */}
        <main className="mt-6 sm:mt-8">
          <AnimatePresence mode="wait">
            {vistaActual === 'formulario' && (
              <motion.div
                key="formulario"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <CleanPromptForm onSubmit={handleFormSubmit} />
              </motion.div>
            )}

            {vistaActual === 'procesando' && (
              <motion.div
                key="procesando"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <CleanProcessingView 
                  procesoActual={procesoActual}
                  progreso={progreso}
                  onBack={() => handleViewChange('formulario')}
                />
              </motion.div>
            )}

            {vistaActual === 'resultados' && (
              <motion.div
                key="resultados"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <ResultsView 
                  resultado={resultado}
                  onNewPrompt={() => handleViewChange('formulario')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <motion.footer 
          className="mt-12 sm:mt-16 text-center text-slate-500 text-xs sm:text-sm px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-2">
            <span>Potenciado por</span>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="font-semibold text-white">OpenAI GPT-4</span>
              <span className="hidden sm:inline">•</span>
              <span className="font-semibold text-slate-300">4 Agentes IA</span>
            </div>
          </div>
          <p className="text-xs">© 2025 HannahPrompts. Creando el futuro de la optimización de prompts.</p>
        </motion.footer>
      </div>
    </MainLayout>
  );
}

export default HomePage;
