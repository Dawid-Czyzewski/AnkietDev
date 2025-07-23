import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gray-900 text-gray-100 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-blue-900 opacity-60"></div>
      <div className="relative container mx-auto px-4 flex flex-col items-center justify-center text-center min-h-screen">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
          {t('hero_main')}
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl mb-8 text-gray-300">
          {t('hero_sub')}
        </p>
        <a
          href="/#/register"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-md font-medium transition"
        >
          {t('get_started')}
        </a>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900"></div>
    </section>
  );
};

export default Home;
