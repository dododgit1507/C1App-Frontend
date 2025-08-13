// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  async interpretVoice(audioText) {
    try {
      const response = await fetch(`${API_BASE_URL}/openai/interpret-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioText }),
      });

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error interpretando voz:', error);
      throw error;
    }
  }

  async processPrompt(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/openai/process-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error procesando prompt:', error);
      throw error;
    }
  }

  async savePrompt(promptData) {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptData),
      });

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error guardando prompt:', error);
      throw error;
    }
  }

  async getPrompts(area = null) {
    try {
      const url = area 
        ? `${API_BASE_URL}/prompts?area=${encodeURIComponent(area)}`
        : `${API_BASE_URL}/prompts`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo prompts:', error);
      throw error;
    }
  }

  async getPromptStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts/stats`);

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  async deletePrompt(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error eliminando prompt:', error);
      throw error;
    }
  }
}

export default new ApiService();
