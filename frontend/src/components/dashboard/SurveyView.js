import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { enUS, pl } from 'date-fns/locale';

const SurveyView = ({ survey, onBack }) => {
  const { t, i18n } = useTranslation();
  const [answers, setAnswers] = useState(
    survey.questions.reduce((acc, q) => ({ ...acc, [q.id]: '' }), {})
  );
  const [copied, setCopied] = useState(false);

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const locale = i18n.language && i18n.language.startsWith('en') ? enUS : pl;

  const formattedExpire = survey.expireDate
    ? format(parseISO(survey.expireDate), 'd MMMM yyyy', { locale })
    : null;

  const handleCopy = async () => {
    try {
      const link = `${window.location.origin}/#/survey/${survey.id}`;
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy link:', e);
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <button
              onClick={onBack}
              className="group relative inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/40 hover:to-gray-700/40 border border-gray-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 overflow-hidden cursor-pointer font-medium text-gray-300 hover:text-white w-full sm:w-auto"
            >
              <div className="relative z-10 flex items-center space-x-2">
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">←</span>
                <span>{t('back')}</span>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </button>
            
            <button
              onClick={handleCopy}
              className="group relative inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/40 hover:to-emerald-600/40 border border-green-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 overflow-hidden cursor-pointer font-medium text-green-300 hover:text-green-200 w-full sm:w-auto"
            >
              <div className="relative z-10 flex items-center space-x-2">
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                  {copied ? '✅' : '🔗'}
                </span>
                <span>{copied ? t('copied') : t('copy_link')}</span>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </button>
          </div>
          
          {formattedExpire && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30 rounded-xl backdrop-blur-md">
                <span className="text-lg">⏰</span>
                <span className="text-red-300 font-medium">
                  {t('expire_on')}: <span className="font-semibold">{formattedExpire}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-4 sm:p-8 hover:bg-gray-800/40 transition-all duration-300">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          <div className="relative z-10">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                {survey.title}
              </h1>
              <div className="flex items-center justify-center space-x-2 text-gray-400">
                <span>📊</span>
                <span>{survey.questions.length} {survey.questions.length === 1 ? t('question_singular') : t('question_plural')}</span>
              </div>
            </div>
            <div className="space-y-6 sm:space-y-8">
              {survey.questions
                .sort((a, b) => a.orderNumber - b.orderNumber)
                .map((q, index) => {
                  let options = [];
                  if (typeof q.options === 'string') {
                    try {
                      options = JSON.parse(q.options);
                    } catch {
                      options = [];
                    }
                  } else if (Array.isArray(q.options)) {
                    options = q.options;
                  }

                  return (
                    <div key={q.id} className="group/question relative backdrop-blur-xl bg-gray-800/20 border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-gray-800/30 transition-all duration-300">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover/question:opacity-100 transition-opacity duration-300 blur-sm"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-white">
                            {q.text}
                          </h3>
                        </div>

                        <div className="ml-8 sm:ml-11">
                          {q.type === 'open' && (
                            <textarea
                              value={answers[q.id]}
                              onChange={e => handleChange(q.id, e.target.value)}
                              className="w-full h-32 px-4 py-3 rounded-xl backdrop-blur-md border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/20 focus:border-purple-500/50 resize-none cursor-pointer transition-all duration-300"
                              placeholder={t('enter_your_answer')}
                            />
                          )}
                          
                          {q.type === 'select' && (
                            <select
                              value={answers[q.id]}
                              onChange={e => handleChange(q.id, e.target.value)}
                              className="w-full px-4 py-3 rounded-xl backdrop-blur-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/20 focus:border-purple-500/50 cursor-pointer transition-all duration-300"
                            >
                              <option value="" disabled className="text-gray-400 bg-gray-800">
                                {t('choose_option')}
                              </option>
                              {options.map((opt, idx) => (
                                <option key={idx} value={opt} className="text-white bg-gray-800">
                                  {opt}
                                </option>
                              ))}
                            </select>
                          )}
                          
                          {q.type === 'radio' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              {options.map((opt, idx) => (
                                <label key={idx} className="group/option relative flex items-center space-x-3 p-2 sm:p-3 rounded-xl backdrop-blur-md border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`q_${q.id}`}
                                    value={opt}
                                    checked={answers[q.id] === opt}
                                    onChange={() => handleChange(q.id, opt)}
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
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyView;
