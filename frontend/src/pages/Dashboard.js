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
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <header className="md:hidden sticky top-0 z-50 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between h-16 px-4">
          <span className="text-lg font-semibold">{t('dashboard')}</span>
        </div>
        <nav className="flex justify-around bg-gray-800 h-12">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`
                flex-1 flex items-center justify-center space-x-1 text-sm font-medium
                ${active === id
                  ? 'border-b-2 border-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block md:w-64 bg-gray-800 border-r border-gray-700">
          <div className="h-16 flex items-center justify-center font-extrabold text-xl border-b border-gray-700">
            {t('dashboard')}
          </div>
          <nav className="mt-4">
            {navItems.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`
                  w-full flex items-center px-4 py-2 mx-2 rounded-lg transition text-left cursor-pointer
                  ${active === id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                `}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto bg-gray-900">
          <Suspense fallback={<div className="p-6">{t('loading')}</div>}>
            {renderContent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
