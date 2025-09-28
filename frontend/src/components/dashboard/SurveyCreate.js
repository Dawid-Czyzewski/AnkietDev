import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { surveyService } from '../../services/surveyService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SurveyCreate = ({ onSave, onBack }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [hasExpiration, setHasExpiration] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');
  const [questions, setQuestions] = useState([]);
  const [creating, setCreating] = useState(false);

  const makeId = () => Date.now() + Math.random();

  const addOpenQuestion = () =>
    setQuestions(qs => [...qs, { id: makeId(), text: '', type: 'open', options: [] }]);
  const addSelectQuestion = () =>
    setQuestions(qs => [...qs, { id: makeId(), text: '', type: 'select', options: [''] }]);
  const addRadioQuestion = () =>
    setQuestions(qs => [...qs, { id: makeId(), text: '', type: 'radio', options: [''] }]);
  const removeQuestion = id =>
    setQuestions(qs => qs.filter(q => q.id !== id));
  const updateQuestionText = (id, text) =>
    setQuestions(qs => qs.map(q => (q.id === id ? { ...q, text } : q)));
  const updateOption = (qid, idx, value) =>
    setQuestions(qs => qs.map(q =>
      q.id === qid
        ? { ...q, options: q.options.map((opt, i) => (i === idx ? value : opt)) }
        : q
    ));
  const addOption = qid =>
    setQuestions(qs => qs.map(q =>
      q.id === qid
        ? { ...q, options: [...q.options, ''] }
        : q
    ));
  const removeOption = (qid, idx) =>
    setQuestions(qs => qs.map(q =>
      q.id === qid
        ? { ...q, options: q.options.filter((_, i) => i !== idx) }
        : q
    ));

  const isFormValid = useMemo(() => {
    if (!title.trim() || questions.length === 0) return false;
    if (hasExpiration) {
      if (!expirationDate) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const exp = new Date(expirationDate);
      if (exp < today) return false;
    }
    return questions.every(q => {
      if (!q.text.trim()) return false;
      if (q.type === 'select' || q.type === 'radio')
        return q.options.some(opt => opt.trim());
      return true;
    });
  }, [title, questions, hasExpiration, expirationDate]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error(t('error_empty_title'));
      return;
    }
    if (hasExpiration) {
      if (!expirationDate) {
        toast.error(t('error_empty_expiration_date'));
        return;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const exp = new Date(expirationDate);
      if (exp < today) {
        toast.error(t('error_past_expiration_date'));
        return;
      }
    }
    for (const [i, q] of questions.entries()) {
      if (!q.text.trim()) {
        toast.error(t('error_empty_question', { number: i + 1 }));
        return;
      }
      if ((q.type === 'select' || q.type === 'radio') && !q.options.some(opt => opt.trim())) {
        toast.error(t('error_no_options', { number: i + 1 }));
        return;
      }
    }

    const payload = {
      title: title.trim(),
      hasExpiration,
      expirationDate: hasExpiration ? expirationDate : null,
      questions
    };

    setCreating(true);
    try {
      const createdSurvey = await surveyService.create(payload);
      onSave(createdSurvey);
    } catch (err) {
      console.error(err);
      alert(t('failed_create'));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="group relative inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/40 hover:to-gray-700/40 border border-gray-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 overflow-hidden cursor-pointer font-medium text-gray-300 hover:text-white mb-6"
          >
            <div className="relative z-10 flex items-center space-x-2">
              <span className="text-lg transition-transform duration-300 group-hover:scale-110">←</span>
              <span>{t('back')}</span>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-600/20 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              {t('create_survey')}
            </h1>
            <p className="text-gray-400 text-lg">
              {t('create_survey_subtitle')}
            </p>
          </div>
        </div>
        <div className="mb-8">
          <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-6 hover:bg-gray-800/40 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <div className="relative z-10">
              <label className="block text-white font-medium mb-3 text-lg">
                📝 {t('title')}
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={t('survey_title_placeholder')}
                className={`w-full px-4 py-3 rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer group/field focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                  !title.trim() 
                    ? 'border-2 border-red-500/50 bg-red-500/10 text-white placeholder-red-300' 
                    : 'border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:bg-white/20 focus:border-purple-500/50'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-6 hover:bg-gray-800/40 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">⏰</span>
                </div>
                <h3 className="text-white font-medium text-lg">{t('expiration_settings')}</h3>
              </div>
              
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  id="hasExpiration"
                  checked={hasExpiration}
                  onChange={e => setHasExpiration(e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded border-2 border-white/30 bg-white/10 text-purple-500 focus:ring-purple-500/50 focus:ring-2"
                />
                <label htmlFor="hasExpiration" className="text-gray-300 cursor-pointer">
                  {t('has_expiration')}
                </label>
              </div>
              
              {hasExpiration && (
                <div className="mt-4">
                  <label className="block text-white font-medium mb-3">
                    📅 {t('expiration_date')}
                  </label>
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={e => setExpirationDate(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer group/field focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                      !expirationDate 
                        ? 'border-2 border-red-500/50 bg-red-500/10 text-white' 
                        : 'border border-white/20 bg-white/10 text-white focus:bg-white/20 focus:border-purple-500/50'
                    }`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-6 hover:bg-gray-800/40 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">➕</span>
                </div>
                <h3 className="text-white font-medium text-lg">{t('add_questions')}</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={addOpenQuestion}
                  className="group relative px-4 py-3 rounded-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/40 hover:to-emerald-600/40 border border-green-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 overflow-hidden cursor-pointer"
                >
                  <div className="relative z-10 flex flex-col items-center space-y-2">
                    <span className="text-2xl">📝</span>
                    <span className="text-white font-medium text-sm">+ {t('add_open')}</span>
                    <span className="text-xs text-green-300">{t('text_question')}</span>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </button>
                
                <button
                  type="button"
                  onClick={addSelectQuestion}
                  className="group relative px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/40 hover:to-cyan-600/40 border border-blue-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 overflow-hidden cursor-pointer"
                >
                  <div className="relative z-10 flex flex-col items-center space-y-2">
                    <span className="text-2xl">☑️</span>
                    <span className="text-white font-medium text-sm">+ {t('add_select')}</span>
                    <span className="text-xs text-blue-300">{t('multiple_choice')}</span>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </button>
                
                <button
                  type="button"
                  onClick={addRadioQuestion}
                  className="group relative px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/40 hover:to-purple-600/40 border border-indigo-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 overflow-hidden cursor-pointer"
                >
                  <div className="relative z-10 flex flex-col items-center space-y-2">
                    <span className="text-2xl">🔘</span>
                    <span className="text-white font-medium text-sm">+ {t('add_radio')}</span>
                    <span className="text-xs text-indigo-300">{t('single_choice')}</span>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {questions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                <span className="text-lg">❓</span>
              </div>
              <h3 className="text-white font-medium text-lg">{t('survey_questions')}</h3>
            </div>
            
            <div className="space-y-6">
              {questions.map((q, idx) => {
                const emptyText = !q.text.trim();
                const noOptions = (q.type === 'select' || q.type === 'radio') && !q.options.some(opt => opt.trim());
                return (
                  <div key={q.id} className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-6 hover:bg-gray-800/40 transition-all duration-300">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{idx + 1}</span>
                          </div>
                          <span className="text-white font-medium text-lg">
                            {t('question')} #{idx + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(q.id)}
                          className="group/remove relative px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/40 hover:to-pink-600/40 border border-red-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 overflow-hidden cursor-pointer"
                        >
                          <div className="relative z-10 flex items-center space-x-1">
                            <span className="text-red-300 hover:text-red-200 text-sm font-medium">🗑️ {t('remove')}</span>
                          </div>
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-white font-medium mb-3">
                          📝 {t('question_text')}
                        </label>
                        <input
                          type="text"
                          value={q.text}
                          onChange={e => updateQuestionText(q.id, e.target.value)}
                          placeholder={t('question_content_placeholder')}
                          className={`w-full px-4 py-3 rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer group/field focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                            emptyText 
                              ? 'border-2 border-red-500/50 bg-red-500/10 text-white placeholder-red-300' 
                              : 'border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:bg-white/20 focus:border-purple-500/50'
                          }`}
                        />
                        {emptyText && (
                          <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                            <span>⚠️</span>
                            <span>{t('error_empty_question_inline')}</span>
                          </p>
                        )}
                      </div>
                      {(q.type === 'select' || q.type === 'radio') && (
                        <div className="space-y-4">
                          <label className="block text-white font-medium mb-3">
                            🎯 {t('options')}
                          </label>
                          <div className="space-y-3">
                            {q.options.map((opt, i) => (
                              <div key={i} className="flex items-center space-x-3">
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={e => updateOption(q.id, i, e.target.value)}
                                  placeholder={t('option_placeholder', { number: i + 1 })}
                                  className={`flex-1 px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer group/field focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                                    noOptions 
                                      ? 'border-2 border-red-500/50 bg-red-500/10 text-white placeholder-red-300' 
                                      : 'border border-white/20 bg-white/10 text-white placeholder-gray-400 focus:bg-white/20 focus:border-purple-500/50'
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeOption(q.id, i)}
                                  className="px-3 py-2 bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/40 hover:to-pink-600/40 border border-red-500/30 rounded-xl text-red-300 hover:text-red-200 transition-all duration-300 hover:scale-105 cursor-pointer"
                                >
                                  🗑️
                                </button>
                              </div>
                            ))}
                          </div>
                          {noOptions && (
                            <p className="text-red-400 text-sm flex items-center space-x-1">
                              <span>⚠️</span>
                              <span>{t('error_no_options_inline')}</span>
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={() => addOption(q.id)}
                            className="group relative inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/40 hover:to-emerald-600/40 border border-green-500/30 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 overflow-hidden cursor-pointer font-medium text-green-300 hover:text-green-200"
                          >
                            <div className="relative z-10 flex items-center space-x-2">
                              <span className="text-lg transition-transform duration-300 group-hover:scale-110">➕</span>
                              <span>+ {t('add_option')}</span>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || creating}
            className={`group relative w-full sm:w-auto px-8 py-4 rounded-2xl transition-all duration-500 overflow-hidden text-lg font-semibold ${
              !isFormValid || creating
                ? 'bg-gray-500/50 cursor-not-allowed border border-gray-500/30'
                : 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border border-purple-500/30 backdrop-blur-md hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 cursor-pointer'
            }`}
          >
            {!isFormValid || creating ? (
              <div className="flex items-center justify-center space-x-3">
                {creating && (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                )}
                <span className="text-white font-medium">
                  {creating ? t('creating') : t('create')}
                </span>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  <span className="text-xl transition-transform duration-300 group-hover:scale-110 flex-shrink-0">🚀</span>
                  <span className="text-white font-medium transition-all duration-300 group-hover:text-white/90">
                    {t('create')}
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
  );
};

export default SurveyCreate;
