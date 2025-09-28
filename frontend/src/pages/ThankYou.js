import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const ThankYou = () => {
    const { t } = useTranslation();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen p-6 relative overflow-hidden">
            <div 
                className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10 transition-all duration-1000"
                style={{
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(99, 102, 241, 0.05) 100%)`
                }}
            />

            <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full animate-ping"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
            
            <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center text-center min-h-screen">
                <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-3xl p-8 sm:p-16 md:p-20 lg:p-24 hover:bg-gray-800/40 transition-all duration-500 max-w-6xl mx-auto">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/25 animate-pulse">
                            <span className="text-4xl animate-bounce">✅</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6 animate-pulse leading-tight">
                            {t('thank_you_title')}
                        </h1>
                        
                        <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed">
                            {t('thank_you_subtitle')}
                        </p>
                        
                        
                        <div className="flex justify-center">
                            <button
                                onClick={() => window.location.href = '/#/'}
                                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border border-purple-500/30 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 overflow-hidden cursor-pointer text-lg font-semibold text-white hover:text-white/90"
                            >
                                <div className="relative z-10 flex items-center space-x-3">
                                    <span className="text-xl transition-transform duration-300 group-hover:scale-110">🏠</span>
                                    <span>{t('return_to_home')}</span>
                                </div>
                                
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    </div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-pulse"></div>
                </div>
                
                <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-ping"></div>
                <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl animate-ping delay-1000"></div>
            </div>
        </div>
    );
}

export default ThankYou;