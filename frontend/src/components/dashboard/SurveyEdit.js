import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { surveyService } from '../../services/surveyService';

const SurveyEdit = ({ survey, onSave, onBack }) => {
  const { t } = useTranslation();

  const initialExpireDate = survey.expireDate ? survey.expireDate.slice(0, 10) : '';
  const [title, setTitle] = useState(survey.title || '');
  const [hasExpiration, setHasExpiration] = useState(!!initialExpireDate);
  const [expirationDate, setExpirationDate] = useState(initialExpireDate);
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const normalized = (survey.questions || []).map(q => ({
      ...q,
      options:
        typeof q.options === 'string'
          ? JSON.parse(q.options)
          : Array.isArray(q.options)
          ? q.options
          : [],
    }));
    setQuestions(normalized);

    const newExpire = survey.expireDate ? survey.expireDate.slice(0, 10) : '';
    setExpirationDate(newExpire);
    setHasExpiration(!!newExpire);
  }, [survey.questions, survey.expireDate]);

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
    setQuestions(qs =>
      qs.map(q =>
        q.id === qid
          ? { ...q, options: q.options.map((opt, i) => (i === idx ? value : opt)) }
          : q
      )
    );
  const addOption = qid =>
    setQuestions(qs =>
      qs.map(q => (q.id === qid ? { ...q, options: [...q.options, ''] } : q))
    );
  const removeOption = (qid, idx) =>
    setQuestions(qs =>
      qs.map(q =>
        q.id === qid
          ? { ...q, options: q.options.filter((_, i) => i !== idx) }
          : q
      )
    );

  const isFormValid = useMemo(() => {
    if (!title.trim()) return false;
    if (hasExpiration) {
      if (!expirationDate) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(expirationDate) < today) return false;
    }
    if (questions.length === 0) return false;
    for (const q of questions) {
      if (!q.text.trim()) return false;
      if (
        (q.type === 'select' || q.type === 'radio') &&
        q.options.filter(opt => opt.trim()).length === 0
      )
        return false;
    }
    return true;
  }, [title, hasExpiration, expirationDate, questions]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error(t('error_form_invalid'));
      return;
    }

    const payload = {
      id: survey.id,
      title: title.trim(),
      hasExpiration,
      expireDate: hasExpiration ? expirationDate : null,
      questions: questions.map((q, idx) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        options: q.options,
        orderNumber: idx + 1,
      })),
    };

    setSaving(true);
    try {
      const updated = await surveyService.update(payload);
      toast.success(t('success_save'));
      onSave(updated);
    } catch (err) {
      console.error(err);
      toast.error(t('failed_save'));
    } finally {
      setSaving(false);
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
      <h1 className="text-2xl font-bold">{t('edit_survey')}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
          {!title.trim() && (
            <p className="text-red-400 text-sm">{t('error_empty_title')}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
          <input
            type="checkbox"
            id="hasExpiration"
            checked={hasExpiration}
            onChange={e => {
              const checked = e.target.checked;
              setHasExpiration(checked);
              if (!checked) setExpirationDate('');
            }}
            className="cursor-pointer"
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
            {!expirationDate && (
              <p className="text-red-400 text-sm">
                {t('error_empty_expiration_date')}
              </p>
            )}
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
            const noOptions =
              (q.type === 'select' || q.type === 'radio') &&
              q.options.filter(opt => opt.trim()).length === 0;

            return (
              <div key={q.id} className="p-4 bg-gray-800 rounded space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {t('question')} #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    className="text-red-400 hover:text-red-600 text-sm cursor-pointer"
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
                    <p className="text-red-400 text-sm">
                      {t('error_empty_question_inline')}
                    </p>
                  )}
                </div>
                {(q.type === 'select' || q.type === 'radio') && (
                  <div className="space-y-2">
                    <label className="block">{t('options')}</label>
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0"
                      >
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
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {noOptions && (
                      <p className="text-red-400 text-sm">
                        {t('error_no_options_inline')}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => addOption(q.id)}
                      className="mt-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm cursor-pointer"
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
          type="submit"
          disabled={!isFormValid || saving}
          className={`w-full sm:w-auto mt-4 px-4 py-2 rounded text-white text-sm cursor-pointer ${
            !isFormValid || saving
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
        >
          {saving ? t('saving') : t('save')}
        </button>
      </form>
    </div>
  );
};

export default SurveyEdit;
