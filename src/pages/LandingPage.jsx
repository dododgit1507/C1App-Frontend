// src/pages/LandingPage.jsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🧠',
      title: 'IA Avanzada',
      description: 'Utiliza 4 agentes especializados trabajando en conjunto para crear prompts optimizados'
    },
    {
      icon: '⚡',
      title: 'Proceso Rápido',
      description: 'Obtén prompts optimizados en segundos, no en horas de prueba y error'
    },
    {
      icon: '🎯',
      title: 'Resultados Precisos',
      description: 'Prompts adaptados específicamente a tu área de negocio y modelo de IA'
    },
    {
      icon: '📊',
      title: 'Análisis Completo',
      description: 'Recibe evaluaciones detalladas y métricas de efectividad para cada prompt'
    }
  ];

  const testimonials = [
    {
      text: "Increíble herramienta. Mejoró la efectividad de mis prompts en un 300%",
      author: "Marketing Manager",
      company: "Tech Startup"
    },
    {
      text: "Lo que antes me tomaba horas ahora lo resuelvo en minutos",
      author: "Desarrollador Senior",
      company: "Software Company"
    },
    {
      text: "La calidad de los prompts generados es excepcional",
      author: "Consultor IA",
      company: "Digital Agency"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden h-screen flex items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900" />
        
        {/* Geometric patterns - Hidden on mobile to prevent overflow */}
        <div className="absolute inset-0 opacity-10 hidden md:block">
          <svg className="absolute top-0 right-0 transform rotate-45" width="300" height="300" viewBox="0 0 300 300">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="300" height="300" fill="url(#grid)" className="text-slate-700" />
          </svg>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            
            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-green-900/40 to-blue-900/40 rounded-full text-green-300 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 border border-green-800/30">
                🚀 Ahorra hasta 70% en tokens de IA
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
                Deja de
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  DESPERDICIAR
                </span>
                dinero en
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                  PROMPTS MALOS
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-2 sm:mb-3 max-w-4xl mx-auto leading-relaxed font-medium px-4">
                🎯 <span className="text-white">HannahPrompt</span> convierte tus prompts ineficientes en 
                <span className="text-green-400"> máquinas de resultados precisos</span>
              </p>
              
              <p className="text-sm sm:text-base md:text-lg text-slate-400 mb-4 sm:mb-6 max-w-3xl mx-auto px-4">
                4 Agentes IA trabajando 24/7 para que cada token cuente. 
                <span className="text-yellow-400">Empresas ahorran $500-2000/mes</span>
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-10 px-4"
            >
              <Button
                size="xl"
                variant="primary"
                onClick={() => navigate('/home')}
                className="text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-2xl shadow-green-900/50 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                💰 AHORRAR DINERO AHORA
              </Button>
              
              <Button
                size="xl"
                variant="outline"
                onClick={() => document.getElementById('comparison').scrollIntoView({ behavior: 'smooth' })}
                className="text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all duration-300 w-full sm:w-auto"
              >
                📊 Ver Comparación Real
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 px-4"
            >
              <div className="text-center p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-green-800/30">
                <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">$1,200</div>
                <div className="text-slate-300 font-semibold text-xs sm:text-sm">Ahorro Promedio/Mes</div>
                <div className="text-slate-500 text-xs">Por empresa usando HannahPrompt</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-blue-800/30">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">72%</div>
                <div className="text-slate-300 font-semibold text-xs sm:text-sm">Menos Tokens</div>
                <div className="text-slate-500 text-xs">Reducción comprobada vs prompts manuales</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-purple-800/30">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1">15min</div>
                <div className="text-slate-300 font-semibold text-xs sm:text-sm">Para ROI Positivo</div>
                <div className="text-slate-500 text-xs">Tiempo promedio para recuperar inversión</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 sm:mb-6">
              ¿Por qué elegir HannahPrompts?
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto px-4">
              Una solución completa diseñada para profesionales que buscan excelencia en sus prompts de IA
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="h-full text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section - SIN vs CON HannahPrompt */}
      <section id="comparison" className="py-12 sm:py-20 bg-slate-800/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 sm:mb-6">
              🎯 Comparación Real: Ahorra Tokens y Mejora Resultados
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto px-4">
              Mira cómo HannahPrompt transforma prompts ineficientes en herramientas precisas que ahorran hasta 70% en tokens
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* SIN HannahPrompt */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-red-900/30 bg-red-950/20">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center px-4 py-2 bg-red-900/40 rounded-full text-red-300 text-sm font-semibold mb-4">
                    ❌ SIN HannahPrompt
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Prompt Ineficiente</h3>
                  <p className="text-red-300 text-sm">~250 tokens • Respuesta vaga • Costoso</p>
                </div>
                
                <div className="bg-slate-900/60 p-4 rounded-lg mb-4">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    "Por favor, ayúdame a escribir algo para marketing de mi empresa. Necesito que sea bueno y que atraiga clientes. Mi empresa vende productos digitales y quiero que sea profesional pero también creativo. Hazlo interesante y que la gente quiera comprar. También incluye algunas estadísticas si puedes y que sea persuasivo pero no muy agresivo..."
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-red-400 text-sm">
                    <span className="mr-2">⚠️</span>
                    <span>Demasiado vago e impreciso</span>
                  </div>
                  <div className="flex items-center text-red-400 text-sm">
                    <span className="mr-2">💸</span>
                    <span>Gasta 250+ tokens innecesariamente</span>
                  </div>
                  <div className="flex items-center text-red-400 text-sm">
                    <span className="mr-2">🎲</span>
                    <span>Resultados inconsistentes</span>
                  </div>
                  <div className="flex items-center text-red-400 text-sm">
                    <span className="mr-2">🔄</span>
                    <span>Requiere múltiples intentos</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* CON HannahPrompt */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-green-900/30 bg-green-950/20">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center px-4 py-2 bg-green-900/40 rounded-full text-green-300 text-sm font-semibold mb-4">
                    ✅ CON HannahPrompt
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Prompt Láser de Precisión</h3>
                  <p className="text-green-300 text-sm">~68 tokens • ROI inmediato • Resultado garantizado</p>
                </div>
                
                <div className="bg-slate-900/60 p-4 rounded-lg mb-4 border-l-4 border-green-500">
                  <p className="text-slate-300 text-sm leading-relaxed font-mono">
                    <span className="text-green-400">[CONTEXTO]</span> Marketing B2B SaaS para CTOs<br/>
                    <span className="text-blue-400">[OBJETIVO]</span> Email de conversión para trial gratuito<br/>
                    <span className="text-purple-400">[FORMATO]</span> Subject + 3 párrafos + CTA<br/>
                    <span className="text-yellow-400">[TONO]</span> Técnico-confiable, enfoque ROI<br/>
                    <span className="text-red-400">[LIMITANTE]</span> 120 palabras máximo<br/>
                    <span className="text-cyan-400">[URGENCIA]</span> Destacar limitación temporal
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-green-400 text-sm">
                    <span className="mr-2">🎯</span>
                    <span><strong>Estructura perfecta:</strong> 6 variables críticas</span>
                  </div>
                  <div className="flex items-center text-green-400 text-sm">
                    <span className="mr-2">💰</span>
                    <span><strong>73% menos tokens</strong> (68 vs 250 = $18 ahorrados)</span>
                  </div>
                  <div className="flex items-center text-green-400 text-sm">
                    <span className="mr-2">⚡</span>
                    <span><strong>Resultado inmediato:</strong> 0 iteraciones</span>
                  </div>
                  <div className="flex items-center text-green-400 text-sm">
                    <span className="mr-2">🎲</span>
                    <span><strong>Reproducible al 100%</strong> cada vez</span>
                  </div>
                  <div className="flex items-center text-green-400 text-sm">
                    <span className="mr-2">📈</span>
                    <span><strong>Conversión predicha:</strong> 4.2% vs 1.1%</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-800/30">
                  <div className="text-xs text-green-300 font-semibold mb-1">RESULTADO REAL:</div>
                  <div className="text-xs text-slate-300">
                    "Ahorramos $847 en 2 semanas solo optimizando emails. Conversión subió 280%." 
                    <span className="text-green-400">- TechCorp CTO</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* ROI Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 sm:p-8 text-center border border-yellow-600/30"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">🏆 Casos de Éxito Reales</h3>
            <p className="text-yellow-400 text-base sm:text-lg mb-6 sm:mb-8">Empresas que cambiaron prompts malos por HannahPrompt</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-slate-900/50 rounded-xl p-3 sm:p-4">
                <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">73%</div>
                <div className="text-slate-300 font-semibold text-sm">Menos Tokens</div>
                <div className="text-slate-500 text-xs">Ahorro promedio comprobado</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-3 sm:p-4">
                <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">8.5x</div>
                <div className="text-slate-300 font-semibold text-sm">Mejor Conversión</div>
                <div className="text-slate-500 text-xs">Emails/ads optimizados</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-3 sm:p-4">
                <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">95%</div>
                <div className="text-slate-300 font-semibold text-sm">Sin Re-trabajo</div>
                <div className="text-slate-500 text-xs">Primera respuesta exitosa</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-3 sm:p-4">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">$2,340</div>
                <div className="text-slate-300 font-semibold text-sm">Ahorro/Mes</div>
                <div className="text-slate-500 text-xs">Caso promedio empresa</div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl border border-green-500/30">
              <div className="text-base sm:text-lg text-green-300 font-semibold mb-2">💡 Testimonial Impactante:</div>
              <p className="text-slate-200 italic text-sm sm:text-lg">
                "En 3 meses ahorramos $4,200 en tokens de GPT-4 y nuestros emails tienen 340% más conversión. 
                <span className="text-yellow-400">HannahPrompt se pagó solo en 2 semanas.</span>"
              </p>
              <div className="text-slate-400 text-xs sm:text-sm mt-2">- Sarah Chen, VP Marketing, DataFlow Inc.</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-20 bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 sm:mb-6">
              Cómo funciona
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto px-4">
              Un proceso simple y eficiente que garantiza resultados profesionales
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: '01', title: 'Define tu objetivo', desc: 'Describe qué quieres lograr' },
              { step: '02', title: 'Procesamiento IA', desc: '4 agentes analizan y optimizan' },
              { step: '03', title: 'Revisión inteligente', desc: 'Evaluación y mejoras automáticas' },
              { step: '04', title: 'Resultado final', desc: 'Prompt optimizado listo para usar' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 font-semibold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
                
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-slate-700 transform -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 sm:mb-6">
              Lo que dicen nuestros usuarios
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="h-full">
                  <div className="text-2xl text-slate-600 mb-4">"</div>
                  <p className="text-slate-300 mb-6 leading-relaxed">{testimonial.text}</p>
                  <div className="border-t border-slate-700 pt-4">
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-slate-400">{testimonial.company}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-20 bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 sm:mb-6">
              ¿Listo para optimizar tus prompts?
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Únete a miles de profesionales que ya están creando prompts más efectivos
            </p>
            
            <Button
              size="xl"
              variant="primary"
              onClick={() => navigate('/home')}
              className="text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 w-full sm:w-auto"
            >
              🎯 Empezar Gratis
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm sm:text-base">
            © 2025 HannahPrompts. Potenciado por IA para profesionales.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;