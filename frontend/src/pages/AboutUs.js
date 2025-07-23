import { useTranslation } from 'react-i18next';
import { Fade } from 'react-awesome-reveal';

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-br from-purple-800 to-blue-900 text-white overflow-hidden min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-50 blur-lg"></div>
      <div className="relative container mx-auto max-w-3xl text-center space-y-12">
        <Fade cascade damping={0.2}>
          <h2 className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg">
            AnkietDev
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
            {t('about_intro')}
          </p>
          <div className="space-y-10">
            {[ 
              { title: t('feature_free'), desc: t('feature_free_desc') },
              { title: t('feature_easy'), desc: t('feature_easy_desc') },
              { title: t('feature_fast'), desc: t('feature_fast_desc') },
            ].map((feature, i) => (
              <div key={i} className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 mx-auto max-w-xl shadow-md hover:shadow-lg transition">
                <h3 className="text-3xl font-semibold text-purple-600 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
          <a
            href="/#/register"
            className="inline-block bg-white text-purple-800 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            {t('about_cta')}
          </a>
        </Fade>
      </div>
    </section>
  );
};

export default AboutUs;
