import { useTranslation } from 'react-i18next';
import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../i18n';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const FloatingLogo = () => (
    <a href="/" className="group relative">
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-indigo-600/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative px-6 py-3 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-105">
          <span className="text-white font-bold text-xl">AnkietDev</span>
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute top-1 left-1 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
            <div className="absolute top-3 right-2 w-0.5 h-0.5 bg-blue-200/80 rounded-full animate-ping"></div>
            <div className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-purple-200/80 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-500"></div>
      </div>
    </a>
  );


  const NavigationButton = ({ href, onClick, children, variant = "default", isMobile = false }) => {
    const variants = {
      default: {
        gradient: "from-gray-600/20 to-gray-700/20",
        border: "border-gray-500/30",
        hoverGradient: "hover:from-gray-600/40 hover:to-gray-700/40",
        shadow: "hover:shadow-gray-500/25",
        icon: "⚪"
      },
      primary: {
        gradient: "from-purple-600/20 to-blue-600/20",
        border: "border-purple-500/30",
        hoverGradient: "hover:from-purple-600/40 hover:to-blue-600/40",
        shadow: "hover:shadow-purple-500/25",
        icon: "💜"
      },
      success: {
        gradient: "from-green-600/20 to-emerald-600/20",
        border: "border-green-500/30",
        hoverGradient: "hover:from-green-600/40 hover:to-emerald-600/40",
        shadow: "hover:shadow-green-500/25",
        icon: "✨",
        width: "min-w-[160px]"
      },
      danger: {
        gradient: "from-red-600/20 to-red-700/20",
        border: "border-red-500/30",
        hoverGradient: "hover:from-red-600/40 hover:to-red-700/40",
        shadow: "hover:shadow-red-500/25",
        icon: "🚪",
        width: "min-w-[140px]"
      },
      info: {
        gradient: "from-blue-600/20 to-indigo-600/20",
        border: "border-blue-500/30",
        hoverGradient: "hover:from-blue-600/40 hover:to-indigo-600/40",
        shadow: "hover:shadow-blue-500/25",
        icon: "🔑",
        width: "min-w-[140px]"
      }
    };

    const variantStyle = variants[variant];

    const className = `group relative px-6 py-3 rounded-2xl bg-gradient-to-r ${variantStyle.gradient} ${variantStyle.hoverGradient} ${variantStyle.border} border backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-xl ${variantStyle.shadow} overflow-hidden block cursor-pointer ${
      variantStyle.width || 'w-full'
    } ${isMobile ? 'text-center w-full' : ''}`;

    const content = (
      <>
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${variantStyle.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`}></div>
        <div className="relative z-10 flex items-center justify-center space-x-2 w-full whitespace-nowrap">
          <span className="text-lg transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
            {variantStyle.icon}
          </span>
          <span className="text-white font-medium transition-all duration-300 group-hover:text-white/90 whitespace-nowrap">
            {children}
          </span>
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
      </>
    );

    if (href) {
      return (
        <a href={href} className={className} onClick={onClick}>
          {content}
        </a>
      );
    }

  return (
      <button className={className} onClick={onClick}>
        {content}
      </button>
    );
  };

  const NavigationLinks = ({ isMobile = false }) => (
    <div className={`flex items-center ${isMobile ? 'flex-col space-y-4 py-8' : 'space-x-3'}`}>
          {user ? (
            <>
          <NavigationButton href="#/dashboard" onClick={closeMenu} variant="primary" isMobile={isMobile}>
            {t('dashboard')}
          </NavigationButton>
          <NavigationButton onClick={logout} variant="danger" isMobile={isMobile}>
                {t('logout')}
          </NavigationButton>
            </>
          ) : (
            <>
          <NavigationButton href="#/register" onClick={closeMenu} variant="success" isMobile={isMobile}>
            {t('register')}
          </NavigationButton>
          <NavigationButton href="#/login" onClick={closeMenu} variant="info" isMobile={isMobile}>
            {t('login')}
          </NavigationButton>
            </>
          )}
      
      <NavigationButton href="#/contact" onClick={closeMenu} variant="primary" isMobile={isMobile}>
        {t('contact')}
      </NavigationButton>
      
      <NavigationButton href="#/about" onClick={closeMenu} variant="default" isMobile={isMobile}>
        {t('about')}
      </NavigationButton>

      <div className={`flex items-center ${isMobile ? 'w-full justify-center space-x-2' : 'space-x-1'}`}>
        <button
          onClick={() => handleLanguageChange('pl')}
          className={`group relative px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
            i18n.language === 'pl' 
              ? 'bg-gradient-to-r from-red-600/30 to-red-700/30 border border-red-500/50 text-red-300 shadow-lg shadow-red-500/25' 
              : 'bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
          }`}
        >
          <span className="flex items-center space-x-2">
            <span className="text-lg">🇵🇱</span>
            <span className="font-medium text-sm">{t('lang_pl')}</span>
          </span>

          {i18n.language === 'pl' && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </button>
        
        <button
          onClick={() => handleLanguageChange('en')}
          className={`group relative px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
            i18n.language === 'en' 
              ? 'bg-gradient-to-r from-blue-600/30 to-blue-700/30 border border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/25' 
              : 'bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
          }`}
        >
          <span className="flex items-center space-x-2">
            <span className="text-lg">🇺🇸</span>
            <span className="font-medium text-sm">{t('lang_en')}</span>
          </span>
          
          {i18n.language === 'en' && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x / 50}px`,
            top: `${mousePosition.y / 50}px`,
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
      </div>
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      <header 
        className={`fixed top-6 left-6 right-6 z-50 transition-all duration-700 ${
          isScrolled 
            ? 'top-4 scale-95' 
            : 'top-6 scale-100'
        }`}
      >
        <div 
          className={`relative transition-all duration-700 ${
            isScrolled 
              ? 'backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl bg-black/60 shadow-purple-500/20' 
              : ''
          }`}
        >
          {isScrolled && (
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          )}
          
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FloatingLogo />
              </div>
              <nav className="hidden lg:flex items-center space-x-3">
                <NavigationLinks />
          </nav>
              <button
                className="lg:hidden relative p-3 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 group overflow-hidden"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative z-10 w-6 h-6 flex flex-col justify-center space-y-1">
                  <span 
                    className={`block h-0.5 bg-white transition-all duration-300 ${
                      isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                    }`}
                  ></span>
                  <span 
                    className={`block h-0.5 bg-white transition-all duration-300 ${
                      isMenuOpen ? 'opacity-0' : ''
                    }`}
                  ></span>
                  <span 
                    className={`block h-0.5 bg-white transition-all duration-300 ${
                      isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                    }`}
                  ></span>
                </div>
                <div className="absolute top-1 right-1 flex space-x-0.5">
                  <div className={`w-1 h-1 rounded-full transition-all duration-300 ${isMenuOpen ? 'bg-purple-400' : 'bg-white/40'}`}></div>
                  <div className={`w-1 h-1 rounded-full transition-all duration-300 delay-100 ${isMenuOpen ? 'bg-blue-400' : 'bg-white/40'}`}></div>
                  <div className={`w-1 h-1 rounded-full transition-all duration-300 delay-200 ${isMenuOpen ? 'bg-indigo-400' : 'bg-white/40'}`}></div>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div 
          className={`lg:hidden absolute top-full left-0 right-0 mt-4 backdrop-blur-xl border border-white/20 rounded-3xl bg-black/60 shadow-2xl transition-all duration-500 ${
            isMenuOpen 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <div className="px-6 py-6">
            <NavigationLinks isMobile={true} />
          </div>
        </div>
    </header>
      <div className="h-32"></div>
    </>
  );
};

export default Header;
