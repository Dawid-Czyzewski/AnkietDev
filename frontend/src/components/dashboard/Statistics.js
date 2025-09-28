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
        setLoading(true);
        const all = await surveyService.list();
        const surveysWithResponses = all.map(s => {
          const responsesCount = s.questions
            .reduce((sum, q) => sum + (q.answers?.length || 0), 0);
          return {
            id: s.id,
            title: s.title,
            responses: responsesCount,
            questionsCount: s.questions?.length || 0
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
    return (
      <div className="min-h-screen p-6 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="relative z-10 text-center">
          <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-8">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {t('loading_statistics')}
            </h2>
            <p className="text-gray-400">{t('please_wait')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'detail' && selectedSurveyId !== null) {
    return (
      <div className="min-h-screen p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <button
            onClick={() => {
              setPage('list');
              setSelectedSurveyId(null);
              setLoading(true);
            }}
            className="group relative inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/40 hover:to-gray-700/40 border border-gray-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 overflow-hidden cursor-pointer font-medium text-gray-300 hover:text-white mb-6"
          >
            <div className="relative z-10 flex items-center space-x-2">
              <span className="text-lg transition-transform duration-300 group-hover:scale-110">←</span>
              <span>{t('back')}</span>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          </button>
          
          <Suspense fallback={
            <div className="text-center">
              <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-8">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {t('loading_details')}
                </h2>
                <p className="text-gray-400">{t('please_wait')}</p>
              </div>
            </div>
          }>
            <SurveyStatsDetail surveyId={selectedSurveyId} />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-8 hover:bg-gray-800/40 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  {t('survey_statistics')}
                </h2>
              </div>
              
              <p className="text-gray-300 text-lg">
                {t('statistics_subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map(s => (
            <div
              key={s.id}
              className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-6 hover:bg-gray-800/40 transition-all duration-300 flex flex-col h-full"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              
              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-3 leading-tight">
                  {s.title}
                </h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm flex items-center space-x-1">
                      <span>👥</span>
                      <span>{t('responses')}</span>
                    </span>
                    <span className="text-white font-semibold">{s.responses}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm flex items-center space-x-1">
                      <span>❓</span>
                      <span>{t('questions')}</span>
                    </span>
                    <span className="text-white font-semibold">{s.questionsCount}</span>
                  </div>
                  
                </div>
                
                <button
                  className="group/btn relative mt-auto w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/40 hover:to-cyan-600/40 border border-blue-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 overflow-hidden cursor-pointer font-medium text-blue-300 hover:text-blue-200"
                  onClick={() => {
                    setSelectedSurveyId(s.id);
                    setPage('detail');
                  }}
                >
                  <div className="relative z-10 flex items-center justify-center space-x-2">
                    <span className="text-lg transition-transform duration-300 group-hover/btn:scale-110">📊</span>
                    <span>{t('view_detailed_stats')}</span>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
