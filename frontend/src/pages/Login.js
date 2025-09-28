import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.email) errs.email = t('validation_email_required');
    if (!formData.password) errs.password = t('validation_password_required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(t('login_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { name: 'email', type: 'email', placeholder: t('email_placeholder') },
    { name: 'password', type: 'password', placeholder: t('password_placeholder') }
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
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block relative group mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-indigo-600/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative px-6 py-3 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-105">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {t('login')}
                </h1>

                <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
              </div>
            </div>

            <p className="text-lg text-gray-300">
              {t('login_description')}
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-indigo-600/30 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {fields.map((field) => (
                  <div key={field.name} className="group/field">
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-200 mb-2">
                      {t(field.name)}
                    </label>
                    <div className="relative">
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-gray-700/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {errors[field.name] && (
                      <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                        <span>⚠️</span>
                        <span>{errors[field.name]}</span>
                      </p>
                    )}
                  </div>
                ))}

                <div className="pt-4">
                  <div className="relative group/button">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 via-blue-600/50 to-indigo-600/50 rounded-2xl blur-lg opacity-0 group-hover/button:opacity-100 transition-opacity duration-500"></div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative w-full py-4 px-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 group-hover/button:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>{t('logging_in')}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>🔑</span>
                          <span>{t('login')}</span>
                          <span className="group-hover/button:translate-x-1 transition-transform duration-300">→</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-gray-400">
                    {t('dont_have_account')} 
                    <a 
                      href="/#/register" 
                      className="text-purple-400 hover:text-purple-300 transition-colors duration-300 cursor-pointer font-medium ml-1"
                    >
                      {t('register')}
                    </a>
                  </p>
                </div>
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

export default Login;