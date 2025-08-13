// src/services/apiClient.js
// Cliente para comunicarse con el backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = {
  // Procesar solicitud completa (4 agentes)
  procesarSolicitudCompleta: async (especialidad, modelo, consulta, onProgress, modeloInfo = null) => {
    console.log('🚀 =================================');
    console.log('🌐 ENVIANDO SOLICITUD AL BACKEND');
    console.log('📋 Especialidad:', especialidad);
    console.log('🤖 Modelo:', modelo);
    console.log('❓ Consulta:', consulta);
    console.log('=================================');

    try {
      // Extraer los datos de la consulta para el formato que espera el backend
      const lines = consulta.split('\n');
      let objetivo = '';
      let reto = '';
      
      // Parsear la consulta para extraer objetivo y reto
      for (const line of lines) {
        if (line.startsWith('OBJETIVO:')) {
          objetivo = line.replace('OBJETIVO:', '').trim();
        } else if (line.startsWith('RETO ESPECÍFICO:')) {
          reto = line.replace('RETO ESPECÍFICO:', '').trim();
        }
      }

      // Si no se encontraron, usar la consulta completa como objetivo
      if (!objetivo) {
        objetivo = consulta;
      }

      const requestBody = {
        areaNegocio: especialidad,
        objetivo: objetivo,
        reto: reto || 'No especificado',
        modelo: modelo,
        idioma: 'español',
        tono: 'profesional',
        estructura: 'paso_a_paso',
        optimizacion: 'completa',
        modeloInfo
      };

      console.log('📤 Datos enviados al backend:', requestBody);

      // Iniciar progreso inmediatamente
      if (onProgress) {
        onProgress({
          fase: 'agente1',
          mensaje: '🔧 Agente 1: Analizando estructura con IA...',
          estado: 'procesando'
        });
      }

      // Hacer la llamada al backend
      const response = await fetch(`${API_BASE_URL}/agents/process-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.message || 'Error del servidor'}`);
      }

      const resultado = await response.json();
      
      console.log('📥 Respuesta del backend recibida:', resultado);

      // Ahora que tenemos la respuesta, simular el progreso restante RÁPIDAMENTE
      if (onProgress) {
        // Completar agente 1
        onProgress({
          fase: 'agente1',
          mensaje: '🔧 Agente 1: Estructura analizada ✅',
          estado: 'completado'
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Agente 2
        onProgress({
          fase: 'agente2',
          mensaje: '✍️ Agente 2: Creando prompt base...',
          estado: 'procesando'
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        onProgress({
          fase: 'agente2',
          mensaje: '✍️ Agente 2: Prompt base creado ✅',
          estado: 'completado'
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Agente 3
        onProgress({
          fase: 'agente3',
          mensaje: '🔍 Agente 3: Revisando y mejorando...',
          estado: 'procesando'
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        onProgress({
          fase: 'agente3',
          mensaje: '🔍 Agente 3: Revisión completada ✅',
          estado: 'completado'
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Agente 4
        onProgress({
          fase: 'agente4',
          mensaje: '🎯 Agente 4: Generando versión final...',
          estado: 'procesando'
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        onProgress({
          fase: 'agente4',
          mensaje: '🎯 Agente 4: Prompt final completado ✅',
          estado: 'completado'
        });
      }

      return resultado;

    } catch (error) {
      console.error('❌ Error en apiClient.procesarSolicitudCompleta:', error);
      
      // Manejo de errores específicos
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('❌ No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:3001');
      } else if (error.message.includes('404')) {
        throw new Error('❌ Endpoint no encontrado. Verifica la configuración del backend.');
      } else if (error.message.includes('500')) {
        throw new Error('❌ Error interno del servidor. Revisa los logs del backend.');
      } else {
        throw error;
      }
    }
  },

  // Procesar solicitud simple (1 agente)
  procesarSolicitudSimple: async (especialidad, modelo, consulta) => {
    console.log('🚀 =================================');
    console.log('🌐 ENVIANDO SOLICITUD SIMPLE AL BACKEND');
    console.log('📋 Especialidad:', especialidad);
    console.log('🤖 Modelo:', modelo);
    console.log('❓ Consulta:', consulta);
    console.log('=================================');

    try {
      const requestBody = {
        especialidad,
        modelo,
        consulta
      };

      console.log('📤 Datos enviados al backend:', requestBody);

      const response = await fetch(`${API_BASE_URL}/agents/process-simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.message || 'Error del servidor'}`);
      }

      const resultado = await response.json();
      
      console.log('📥 Respuesta del backend recibida:', resultado);

      return resultado;

    } catch (error) {
      console.error('❌ Error en apiClient.procesarSolicitudSimple:', error);
      
      // Manejo de errores específicos
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('❌ No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:3001');
      } else if (error.message.includes('404')) {
        throw new Error('❌ Endpoint no encontrado. Verifica la configuración del backend.');
      } else if (error.message.includes('500')) {
        throw new Error('❌ Error interno del servidor. Revisa los logs del backend.');
      } else {
        throw error;
      }
    }
  },

  // Interpretar voz (OpenAI)
  interpretarVoz: async (textoCompleto) => {
    console.log('🚀 =================================');
    console.log('🎤 ENVIANDO INTERPRETACIÓN DE VOZ AL BACKEND');
    console.log('📝 Texto:', textoCompleto);
    console.log('=================================');

    try {
      const requestBody = {
        texto: textoCompleto
      };

      console.log('📤 Datos enviados al backend:', requestBody);

      const response = await fetch(`${API_BASE_URL}/openai/interpret-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.message || 'Error del servidor'}`);
      }

      const resultado = await response.json();
      
      console.log('📥 Respuesta del backend recibida:', resultado);

      return resultado;

    } catch (error) {
      console.error('❌ Error en apiClient.interpretarVoz:', error);
      
      // Manejo de errores específicos
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('❌ No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:3001');
      } else if (error.message.includes('404')) {
        throw new Error('❌ Endpoint no encontrado. Verifica la configuración del backend.');
      } else if (error.message.includes('500')) {
        throw new Error('❌ Error interno del servidor. Revisa los logs del backend.');
      } else {
        throw error;
      }
    }
  },

  // Verificar conexión con el backend
  verificarConexion: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend conectado:', data);
        return true;
      } else {
        console.log('⚠️ Backend respondió con error:', response.status);
        return false;
      }
    } catch (error) {
      console.log('❌ No se pudo conectar con el backend:', error.message);
      return false;
    }
  }
};

export default apiClient;
