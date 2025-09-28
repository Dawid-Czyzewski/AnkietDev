import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Modal = ({ show, title, children, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-md transition-all duration-300 ${
        isAnimating ? 'bg-black/60' : 'bg-black/0'
      }`}
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
      
      <div
        className={`
          relative backdrop-blur-xl bg-gray-800/30 border border-white/10 text-white
          rounded-2xl shadow-2xl
          w-11/12 sm:w-10/12 md:w-2/3 lg:w-1/2 max-w-lg
          max-h-[90vh] overflow-y-auto
          transition-all duration-300 ease-out
          ${isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
        `}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 to-blue-600/10"></div>
        
        <div className="relative z-10 p-6 sm:p-8">
          {title && (
            <header className="mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⚠️</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  {title}
                </h2>
              </div>
            </header>
          )}
          
          <div className="mb-8 text-gray-200 leading-relaxed">
            {children}
          </div>
          
          <footer className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onCancel}
              className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/40 hover:to-gray-700/40 border border-gray-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 overflow-hidden cursor-pointer font-medium text-gray-300 hover:text-white w-full sm:w-auto"
            >
              <div className="relative z-10 flex items-center justify-center space-x-2">
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">❌</span>
                <span>{t('cancel')}</span>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </button>
            
            <button
              onClick={onConfirm}
              className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/40 hover:to-pink-600/40 border border-red-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 overflow-hidden cursor-pointer font-medium text-red-300 hover:text-red-200 w-full sm:w-auto"
            >
              <div className="relative z-10 flex items-center justify-center space-x-2">
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">🗑️</span>
                <span>{t('confirm')}</span>
              </div>
        
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
            </button>
          </footer>
        </div>
        
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-pulse"></div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  title: null,
  children: null,
};

export default Modal;
