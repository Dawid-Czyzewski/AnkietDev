import { useTranslation } from 'react-i18next';
import { useState, lazy, Suspense } from 'react';
import { HomeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Overview   = lazy(() => import('../components/dashboard/Overview'));
const Statistics = lazy(() => import('../components/dashboard/Statistics'));

const Dashboard = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState('overview');

  const navItems = [
    { id: 'overview',   label: t('overview'),   Icon: HomeIcon },
    { id: 'statistics', label: t('statistics'), Icon: ChartBarIcon },
  ];

  const renderContent = () => {
    switch (active) {
      case 'overview':   return <Overview />;
      case 'statistics': return <Statistics />;
      default:           return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <header className="md:hidden sticky top-0 z-50 backdrop-blur-xl bg-gray-800/50 border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {t('dashboard')}
            </span>
          </div>
        </div>
        <nav className="flex justify-around backdrop-blur-xl bg-gray-800/30 h-14">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`
                flex-1 flex items-center justify-center space-x-2 text-sm font-medium transition-all duration-300 cursor-pointer relative
                ${active === id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'}
              `}
            >
              {active === id && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg mx-2"></div>
              )}
              <Icon className={`w-5 h-5 relative z-10 transition-all duration-300 ${active === id ? 'scale-110' : ''}`} />
              <span className="relative z-10">{label}</span>
              {active === id && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10">
        <aside className="hidden md:block md:w-72 backdrop-blur-xl bg-gray-800/30 border-r border-white/10">
          <div className="h-20 flex items-center justify-center border-b border-white/10">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t('dashboard')}
              </span>
            </div>
          </div>
          <nav className="mt-6 px-4">
            {navItems.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`
                  w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 text-left cursor-pointer group mb-2 relative
                  ${active === id
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/50 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'}
                `}
              >
                {active === id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl"></div>
                )}
                <Icon className={`h-6 w-6 mr-4 relative z-10 transition-all duration-300 ${
                  active === id ? 'scale-110' : 'group-hover:scale-105'
                }`} />
                <span className="relative z-10 font-medium">{label}</span>
                {active === id && (
                  <div className="absolute right-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </nav>
        </aside>
        
        <main className="flex-1 overflow-auto bg-gray-900/50 backdrop-blur-sm">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">{t('loading')}</p>
              </div>
            </div>
          }>
            {renderContent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
