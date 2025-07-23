import { useTranslation } from 'react-i18next';
import { useState, useEffect, lazy, Suspense } from 'react';
import { surveyService } from '../../services/surveyService';

const SurveyStatsDetail = lazy(() => import('./SurveyStatsDetail'));

const Statistics = () => {
  const { t } = useTranslation();

  const [page, setPage] = useState('list');
  const [surveys, setSurveys] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (page !== 'list') return;
    (async () => {
      try {
        const all = await surveyService.list();
        const surveysWithResponses = all.map(s => {
          const responsesCount = s.questions
            .reduce((sum, q) => sum + (q.answers?.length || 0), 0);
          return {
            id: s.id,
            title: s.title,
            responses: responsesCount
          };
        });
        setSurveys(surveysWithResponses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  if (loading) {
    return <div className="p-6">{t('loading')}</div>;
  }

  if (page === 'detail' && selectedSurveyId !== null) {
    return (
      <div className="p-6">
        <button
          onClick={() => {
            setPage('list');
            setSelectedSurveyId(null);
            setLoading(true);
          }}
          className="mb-4 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded cursor-pointer"
        >
          ← {t('back')}
        </button>
        <Suspense fallback={<div>{t('loading')}</div>}>
          <SurveyStatsDetail surveyId={selectedSurveyId} />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-white">
        {t('survey_statistics')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {surveys.map(s => (
          <div
            key={s.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-2 text-white">
              {s.title}
            </h3>
            <p className="text-gray-300 mb-4">
              {t('responses_count', { count: s.responses })}
            </p>
            <button
              className="mt-auto w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
              onClick={() => {
                setSelectedSurveyId(s.id);
                setPage('detail');
              }}
            >
              {t('view_detailed_stats')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
