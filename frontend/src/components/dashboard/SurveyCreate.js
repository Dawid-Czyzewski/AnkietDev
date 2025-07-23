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
    <div className="p-4 sm:p-6 mx-auto space-y-6 w-full">
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded cursor-pointer"
      >
        ← {t('back')}
      </button>
      <h1 className="text-2xl font-bold">{t('create_survey')}</h1>
      <div>
        <label className="block mb-1">{t('title')}</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={`w-full px-3 py-2 rounded ${
            !title.trim() ? 'border-red-500 border' : 'bg-gray-700 text-white'
          }`}
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
        <input
          type="checkbox"
          id="hasExpiration"
          checked={hasExpiration}
          onChange={e => setHasExpiration(e.target.checked)}
          className='cursor-pointer'
        />
        <label htmlFor="hasExpiration">{t('has_expiration')}</label>
      </div>
      {hasExpiration && (
        <div>
          <label className="block mb-1">{t('expiration_date')}</label>
          <input
            type="date"
            value={expirationDate}
            onChange={e => setExpirationDate(e.target.value)}
            className={`w-full px-3 py-2 rounded ${
              !expirationDate ? 'border-red-500 border' : 'bg-gray-700 text-white'
            }`}
          />
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
        <button
          type="button"
          onClick={addOpenQuestion}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm cursor-pointer"
        >
          + {t('add_open')}
        </button>
        <button
          type="button"
          onClick={addSelectQuestion}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm cursor-pointer"
        >
          + {t('add_select')}
        </button>
        <button
          type="button"
          onClick={addRadioQuestion}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm cursor-pointer"
        >
          + {t('add_radio')}
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => {
          const emptyText = !q.text.trim();
          const noOptions = (q.type === 'select' || q.type === 'radio') && !q.options.some(opt => opt.trim());
          return (
            <div key={q.id} className="p-4 bg-gray-800 rounded space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {t('question')} #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  {t('remove_question')}
                </button>
              </div>
              <div>
                <label className="block mb-1">{t('question_text')}</label>
                <input
                  type="text"
                  value={q.text}
                  onChange={e => updateQuestionText(q.id, e.target.value)}
                  className={`w-full px-2 py-1 rounded ${
                    emptyText ? 'border-red-500 border' : 'bg-gray-700 text-white'
                  }`}
                />
                {emptyText && (
                  <p className="text-red-400 text-sm">{t('error_empty_question_inline')}</p>
                )}
              </div>
              {(q.type === 'select' || q.type === 'radio') && (
                <div className="space-y-2">
                  <label className="block">{t('options')}</label>
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                      <input
                        type="text"
                        value={opt}
                        onChange={e => updateOption(q.id, i, e.target.value)}
                        className={`flex-1 px-2 py-1 rounded ${
                          noOptions ? 'border-red-500 border' : 'bg-gray-700 text-white'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(q.id, i)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {noOptions && (
                    <p className="text-red-400 text-sm">{t('error_no_options_inline')}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => addOption(q.id)}
                    className="mt-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-whiterounded text-sm"
                  >
                    + {t('add_option')}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={handleSubmit}
        disabled={!isFormValid || creating}
        className={`w-full sm:w-auto mt-4 px-4 py-2 rounded text-white text-sm cursor-pointer ${
          !isFormValid || creating
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {creating ? t('creating') : t('create')}
      </button>
    </div>
  );
};

export default SurveyCreate;
