import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const AboutUs = () => {
  const { t } = useTranslation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { 
      title: t('feature_free'), 
      desc: t('feature_free_desc'),
      icon: '🎁',
      gradient: 'from-green-500 to-emerald-600',
      glow: 'shadow-green-500/25'
    },
    { 
      title: t('feature_easy'), 
      desc: t('feature_easy_desc'),
      icon: '✨',
      gradient: 'from-purple-500 to-indigo-600',
      glow: 'shadow-purple-500/25'
    },
    { 
      title: t('feature_fast'), 
      desc: t('feature_fast_desc'),
      icon: '⚡',
      gradient: 'from-blue-500 to-cyan-600',
      glow: 'shadow-blue-500/25'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 25%, rgba(16, 185, 129, 0.1) 50%, transparent 70%)`
        }}
      ></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-30"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-emerald-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-purple-300 rounded-full animate-ping opacity-30"></div>
      </div>
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <div className="inline-block relative group mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-indigo-600/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="relative px-8 py-4 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-105">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                AnkietDev
              </h1>
              
              <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
            </div>
          </div>

          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-4">
            {t('about_intro')}
          </p>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {t('about_detail')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative"
              style={{
                animationDelay: `${index * 200}ms`
              }}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-500 ${feature.glow}`}></div>
              <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full transition-all duration-500 group-hover:scale-105 group-hover:border-white/20">

                <div className="text-4xl mb-4 text-center">
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-center leading-relaxed">
                  {feature.desc}
                </p>
                
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-block relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/50 via-blue-600/50 to-indigo-600/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <a
              href="/#/register"
              className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-105"
            >
              <span className="mr-2">🚀</span>
              {t('about_cta')}
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </div>
        </div>

        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default AboutUs;
