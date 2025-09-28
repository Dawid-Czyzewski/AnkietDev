import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { sendContactForm } from '../services/contactService';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await sendContactForm(formData);
      if (!response.success) {
        throw new Error(t('contact_error'));
      }
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  const isFormDisabled = status === 'loading';

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
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-block relative group mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-indigo-600/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="relative px-8 py-4 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-105">
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                {t('contact_title')}
              </h1>
              
              <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
            </div>
          </div>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {t('contact_subtitle')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-indigo-600/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group/field">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                    {t('contact_name')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isFormDisabled}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-gray-700/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      placeholder={t('contact_name_placeholder')}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group/field">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                    {t('contact_email')}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isFormDisabled}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-gray-700/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      placeholder={t('contact_email_placeholder')}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group/field">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                    {t('contact_message')}
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      id="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isFormDisabled}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-gray-700/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                      placeholder={t('contact_message_placeholder')}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="relative group/button">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 via-blue-600/50 to-indigo-600/50 rounded-2xl blur-lg opacity-0 group-hover/button:opacity-100 transition-opacity duration-500"></div>
                    
                    <button
                      type="submit"
                      disabled={isFormDisabled}
                      className="relative w-full py-4 px-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 group-hover/button:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                    >
                      {isFormDisabled ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>{t('submitting')}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>📧</span>
                          <span>{t('submit')}</span>
                          <span className="group-hover/button:translate-x-1 transition-transform duration-300">→</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {status === 'success' && (
                  <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span>✅</span>
                      <span>{t('contact_success')}</span>
                    </div>
                  </div>
                )}
                
                {status === 'error' && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span>❌</span>
                      <span>{t('contact_error')}</span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default Contact;
