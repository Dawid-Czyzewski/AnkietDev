import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { surveyService } from '../../services/surveyService';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7f50',
  '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb'
];

const SurveyStatsDetail = ({ surveyId }) => {
  const { t } = useTranslation();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await surveyService.get(surveyId);
        setSurvey(data);
      } catch (err) {
        console.error(err);
        setError(t('failed_fetch'));
      } finally {
        setLoading(false);
      }
    })();
  }, [surveyId, t]);

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
  
  if (error) {
    return (
      <div className="min-h-screen p-6 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 text-center">
          <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-red-500/30 rounded-2xl p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {t('error')}
            </h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/40 hover:to-pink-600/40 border border-red-500/30 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer text-red-300 hover:text-red-200"
            >
              {t('try_again')}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!survey) {
    return (
      <div className="min-h-screen p-6 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-gray-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gray-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 text-center">
          <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-gray-500/30 rounded-2xl p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❓</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent mb-2">
              {t('survey_not_found')}
            </h2>
            <p className="text-gray-300">{t('survey_not_found')}</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
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
              
              <h3 className="text-xl text-white font-medium mb-2">
                {survey.title}
              </h3>
              
              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <div className="flex items-center space-x-1">
                  <span>❓</span>
                  <span>{(survey.questions || []).length} {(survey.questions || []).length === 1 ? t('question_singular') : t('question_plural')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📈</span>
                  <span>{t('response_analysis')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>


      {(survey.questions || []).length === 0 ? (
          <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">{t('no_questions')}</h3>
              <p className="text-gray-400">{t('no_questions')}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {(survey.questions || []).map((q, index) => {
            const answers = Array.isArray(q.answers) ? q.answers : [];
            const total = answers.length;

            let chartData = [];
            if (['select', 'radio'].includes(q.type) && total > 0) {
              const counts = answers.reduce((acc, a) => {
                acc[a.text] = (acc[a.text] || 0) + 1;
                return acc;
              }, {});
              chartData = Object.entries(counts).map(([name, cnt]) => ({
                name,
                value: parseFloat(((cnt / total) * 100).toFixed(1)),
                count: cnt,
              }));
            }

            return (
              <div
                key={q.id}
                  className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-6 hover:bg-gray-800/40 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white leading-tight">
                            {q.text}
                          </h3>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg text-blue-300 text-xs font-medium">
                            {q.type === 'open' ? t('open_question') : q.type === 'radio' ? t('single_choice') : t('multiple_choice')}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {total} {total === 1 ? t('response_singular') : t('response_plural')}
                          </span>
                        </div>
                      </div>
                      
                </div>
                    <div className="flex-1">
                {q.type === 'open' ? (
                    total > 0 ? (
                          <div className="mt-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-white/10 rounded-xl p-4 backdrop-blur-md">
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="text-sm text-gray-400">
                                📝 {t('total_responses')}: {total}
                              </span>
                            </div>
                            <div className="space-y-3">
                          {answers.map((a, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors duration-200">
                                  <p className="text-gray-100 text-sm leading-relaxed">
                              {a.text}
                            </p>
                                </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                          <div className="mt-4 text-center py-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <span className="text-xl">📭</span>
                            </div>
                            <p className="text-gray-400">{t('no_responses')}</p>
                          </div>
                        )
                ) : (
                  total > 0 ? (
                    <div className="mt-4 flex-1">
                            <div className="bg-gradient-to-r from-gray-700/30 to-gray-800/30 border border-white/10 rounded-xl p-4 backdrop-blur-md">
                              <div className="flex items-center space-x-2 mb-3">
                                <span className="text-sm text-gray-400">
                                  📊 {t('total_responses')}: {total}
                                </span>
                              </div>
                              <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                                    outerRadius="70%"
                                    innerRadius="30%"
                            labelLine={false}
                            label={({ name, value, count }) => `${name}: ${value}% (${count})`}
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth={2}
                          >
                            {chartData.map((_, idx) => (
                              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            ))}
                                    <LabelList 
                                      dataKey="value" 
                                      position="inside" 
                                      formatter={val => `${val}%`}
                                      fill="white"
                                      fontSize={12}
                                      fontWeight="bold"
                                    />
                          </Pie>
                                  <Tooltip 
                                    formatter={(val, _, payload) => {
                            const cnt = payload?.payload?.count;
                            return [`${val}% (${cnt})`, payload?.name];
                                    }}
                                    contentStyle={{
                                      backgroundColor: 'rgba(31, 41, 55, 0.9)',
                                      border: '1px solid rgba(255, 255, 255, 0.1)',
                                      borderRadius: '8px',
                                      color: 'white'
                                    }}
                                  />
                                  <Legend 
                                    verticalAlign="bottom" 
                                    height={36}
                                    wrapperStyle={{
                                      color: 'white',
                                      fontSize: '12px'
                                    }}
                                  />
                        </PieChart>
                      </ResponsiveContainer>
                            </div>
                    </div>
                  ) : (
                          <div className="mt-4 text-center py-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <span className="text-xl">📭</span>
                            </div>
                            <p className="text-gray-400">{t('no_responses')}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
};

export default SurveyStatsDetail;
