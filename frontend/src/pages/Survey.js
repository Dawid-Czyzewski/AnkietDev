import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
import { surveyService } from '../services/surveyService';

const Survey = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const surveyId = id;
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchSurvey() {
      try {
        setLoading(true);
        const found = await surveyService.get(surveyId);
        if (!found) throw new Error(t('error_survey_not_found'));
        const normalized = (found.questions || []).map(q => ({
          ...q,
          options: typeof q.options === 'string'
            ? JSON.parse(q.options)
            : Array.isArray(q.options)
              ? q.options
              : [],
        }));
        setSurvey({ ...found, questions: normalized });
      } catch (err) {
        console.error(err);
        setError(err.message || t('error_fetching_survey'));
      } finally {
        setLoading(false);
      }
    }
    fetchSurvey();
  }, [surveyId, t]);

  const handleChange = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!survey) return;
    for (const q of survey.questions) {
      const ans = answers[q.id];
      if (!ans || (Array.isArray(ans) ? ans.length === 0 : !ans.toString().trim())) {
        toast.error(t('error_answer_required', { number: q.orderNumber }));
        return;
      }
    }
    const payload = {
      surveyId: survey.id,
      answers: survey.questions.map(q => ({ questionId: q.id, answer: answers[q.id] })),
    };

    setSubmitting(true);
    try {
      const answer = await surveyService.submit(payload);
      if (answer.success) {
        navigate('/thankYou');
      } else {
        toast.error(t('error_submit_survey'));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('failed_submit'));
    } finally {
      setSubmitting(false);
    }
  };

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
{t('loading_survey')}
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
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        <div className="relative z-10 text-center">
          <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-8">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {t('loading_survey')}
            </h2>
            <p className="text-gray-400">{t('please_wait')}</p>
          </div>
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
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl backdrop-blur-md mb-6">
            <span className="text-lg">📋</span>
            <span className="text-green-300 font-medium">{t('public_survey')}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            {survey.title}
          </h1>
          
          <div className="flex items-center justify-center space-x-4 text-gray-400 text-sm">
            <div className="flex items-center space-x-1">
              <span>📊</span>
              <span>{survey.questions.length} {survey.questions.length === 1 ? t('question_singular') : t('question_plural')}</span>
            </div>
            {survey.expireDate && (
              <div className="flex items-center space-x-1">
                <span>⏰</span>
                <span>{t('expires')} {new Date(survey.expireDate).toLocaleDateString('pl-PL')}</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-8 hover:bg-gray-800/40 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <div className="relative z-10 space-y-8">
              {survey.questions.map((q, index) => (
                <div key={q.id} className="group/question relative backdrop-blur-xl bg-gray-800/20 border border-white/10 rounded-2xl p-6 hover:bg-gray-800/30 transition-all duration-300">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover/question:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{q.orderNumber}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {q.text}
                      </h3>
                    </div>

                    <div className="ml-11">
                      {q.type === 'open' && (
                        <textarea
                          rows={4}
                          value={answers[q.id] || ''}
                          onChange={e => handleChange(q.id, e.target.value)}
                          placeholder={t('enter_your_answer_placeholder')}
                          className="w-full px-4 py-3 rounded-xl backdrop-blur-md border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/20 focus:border-purple-500/50 resize-none cursor-pointer transition-all duration-300"
                        />
                      )}
                      
                      {q.type === 'select' && (
                        <select
                          value={answers[q.id] || ''}
                          onChange={e => handleChange(q.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl backdrop-blur-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/20 focus:border-purple-500/50 cursor-pointer transition-all duration-300"
                        >
                          <option value="" disabled className="text-gray-400 bg-gray-800">
                            {t('choose_option')}
                          </option>
                          {q.options.map((opt, i) => (
                            <option key={i} value={opt} className="text-white bg-gray-800">
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {q.type === 'radio' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {q.options.map((opt, i) => (
                            <label key={i} className="group/option relative flex items-center space-x-3 p-3 rounded-xl backdrop-blur-md border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                              <input
                                type="radio"
                                name={`q_${q.id}`}
                                value={opt}
                                checked={answers[q.id] === opt}
                                onChange={e => handleChange(q.id, e.target.value)}
                                className="w-5 h-5 text-purple-500 bg-white/10 border-white/20 focus:ring-purple-500/50 focus:ring-2 rounded-full cursor-pointer"
                              />
                              <span className="text-white font-medium group-hover/option:text-purple-300 transition-colors duration-300">
                                {opt}
                              </span>
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-0 group-hover/option:opacity-100 transition-opacity duration-300"></div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`group relative px-8 py-4 rounded-2xl transition-all duration-500 overflow-hidden text-lg font-semibold ${
                    submitting
                      ? 'bg-gray-500/50 cursor-not-allowed border border-gray-500/30'
                      : 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border border-purple-500/30 backdrop-blur-md hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 cursor-pointer'
                  }`}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-white font-medium">
                        {t('submitting')}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                      
                      <div className="relative z-10 flex items-center justify-center space-x-3">
                        <span className="text-xl transition-transform duration-300 group-hover:scale-110 flex-shrink-0">🚀</span>
                        <span className="text-white font-medium transition-all duration-300 group-hover:text-white/90">
                          {t('submit')}
                        </span>
                        <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </div>
                      
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Survey;
