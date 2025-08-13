# C1App-Frontend

## HannahPrompts - Sistema de Optimización de Prompts con IA

Una aplicación web moderna construida con React que utiliza múltiples agentes de IA para optimizar prompts de manera inteligente.

### 🚀 Características

- **Interfaz Moderna**: Diseño elegante con tema oscuro y animaciones fluidas
- **4 Agentes IA Especializados**: Estructurador, Prompteador, Revisor e Implementador
- **Optimización Multi-paso**: Proceso completo de análisis y mejora de prompts
- **Responsive Design**: Optimizado para móviles, tablets y desktop
- **Landing Page Profesional**: Página de inicio con ejemplos y comparaciones
- **Procesamiento en Tiempo Real**: Visualización del progreso de optimización

### �️ Tecnologías

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Routing**: React Router DOM
- **API**: Integración con backend Node.js/Express

### 📱 Responsive Features

- Mobile-first design
- Optimized touch targets
- Responsive grids and layouts
- Mobile-optimized forms and inputs
- Horizontal scroll prevention

### 🎯 Funcionalidades Principales

1. **Formulario de Configuración**
   - Selección de área de negocio
   - Definición de objetivos
   - Entrada por voz (opcional)
   - Recomendación automática de modelo IA

2. **Procesamiento Inteligente**
   - Visualización en tiempo real del progreso
   - 4 agentes trabajando en secuencia
   - Indicadores de estado por agente

3. **Resultados Optimizados**
   - Prompt final optimizado
   - Análisis detallado de cada agente
   - Métricas de mejora
   - Función de copia rápida

### 🚀 Instalación y Uso

```bash
# Clonar el repositorio
git clone https://github.com/dododgit1507/C1App-Frontend.git

# Instalar dependencias
cd C1App-Frontend
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

### 🔧 Configuración

Asegúrate de tener el backend ejecutándose en `http://localhost:3001` para la funcionalidad completa.

### 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── features/     # Componentes de funcionalidades principales
│   ├── forms/        # Formularios y inputs
│   ├── layout/       # Componentes de layout
│   └── ui/           # Componentes UI reutilizables
├── pages/            # Páginas principales
├── services/         # Servicios y APIs
├── utils/            # Utilidades y helpers
└── data/             # Datos estáticos
```

### 🎨 Design System

- **Colores**: Paleta slate (900-100) para tema oscuro elegante
- **Tipografía**: Font system stack optimizada
- **Spacing**: Sistema consistente basado en Tailwind
- **Componentes**: Sistema de componentes reutilizables

### 📈 Performance

- Lazy loading de componentes
- Optimización de bundle con Vite
- Minimización de re-renders
- Optimización de imágenes y assets

### 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

### 🔗 Enlaces

- [Backend Repository](https://github.com/dododgit1507/prompt-optimizer-backend)
- [Demo Live](https://hannahprompts.vercel.app)

---

Desarrollado con ❤️ para optimizar la interacción con IA
4. **🚀 Agente Implementador**: Implementa las mejoras y crea la versión final

### Selección Inteligente de Modelos
- **Selección automática** basada en el análisis del contexto y objetivos de negocio
- **Selección manual** para usuarios que prefieren elegir su modelo
- Soporte para GPT-4, Claude 3 Opus, Gemini 1.5 Pro, y DeepSeek

### Interfaz Orientada a Negocios
- Preguntas enfocadas en **área de negocio**, **objetivos** y **retos específicos**
- Diseño intuitivo y fácil de usar
- Resultados detallados con explicaciones técnicas

### Funcionalidades Avanzadas
- **Traducción automática** a inglés para ahorrar tokens
- **Comparación** entre versión base y final
- **Estadísticas de optimización** y mejoras implementadas
- **Consejos de uso** específicos para cada modelo

## 🛠️ Instalación y Configuración

1. **Clona el repositorio**
```bash
git clone https://github.com/dododgit1507/hannahprompt.git
cd hannahprompt
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
```bash
cp .env.example .env
```
Edita el archivo `.env` y agrega tu API key de OpenAI:
```
VITE_OPENAI_API_KEY=tu_api_key_aqui
```

4. **Ejecuta el proyecto**
```bash
npm run dev
```

## 🔧 Tecnologías Utilizadas

- **Frontend**: React 19.1.1 + Vite 7.1.0
- **Estilos**: Tailwind CSS
- **IA**: OpenAI API (GPT-4o-mini para procesamiento)
- **Arquitectura**: Sistema de agentes especializados

## 🚀 Despliegue en Railway

Para desplegar en Railway:

1. **Conecta tu repositorio** en Railway
2. **Configura las variables de entorno** en Railway:
   - `VITE_OPENAI_API_KEY`: Tu API key de OpenAI
3. **Railway detectará automáticamente** que es un proyecto Vite y lo desplegará

## 🔐 Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `VITE_OPENAI_API_KEY` | API Key de OpenAI para el procesamiento de IA | ✅ Sí |

---

⭐ ¡Si te gusta este proyecto, dale una estrella en GitHub!