import { useTranslation } from 'react-i18next';

const ThankYou = () => {
    const { t } = useTranslation();

    return (
        <section className="relative bg-gray-900 text-gray-100 overflow-hidden">
            <div className="relative container mx-auto px-4 flex flex-col items-center justify-center text-center min-h-screen">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
                    {t('thank_you_title')}
                </h1>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900"></div>
        </section>
    );
}

export default ThankYou;