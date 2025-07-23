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
    <div className="min-h-screen p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onBack}
            className="mb-4 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded cursor-pointer"
          >
            ← {t('back')}
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer"
          >
            {copied ? t('copied') : t('copy_link')}
          </button>
        </div>
        {formattedExpire && (
          <div className="mb-4 text-center italic text-red-600">
            {t('expire_on')}: <span className="font-semibold">{formattedExpire}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <h1 className="text-4xl font-extrabold text-center text-gray-800">
            {survey.title}
          </h1>
          <div className="space-y-10">
            {survey.questions
              .sort((a, b) => a.orderNumber - b.orderNumber)
              .map(q => {
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
                  <div key={q.id} className="space-y-3">
                    <p className="text-lg font-medium text-gray-800">{q.text}</p>
                    {q.type === 'open' && (
                      <textarea
                        value={answers[q.id]}
                        onChange={e => handleChange(q.id, e.target.value)}
                        className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none text-gray-800"
                        placeholder={t('enter_your_answer')}
                      />
                    )}
                    {q.type === 'select' && (
                      <select
                        value={answers[q.id]}
                        onChange={e => handleChange(q.id, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800"
                      >
                        <option value="" disabled className="text-gray-400">
                          {t('choose_option')}
                        </option>
                        {options.map((opt, idx) => (
                          <option key={idx} value={opt} className="text-gray-800">
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                    {q.type === 'radio' && (
                      <div className="flex flex-wrap gap-6">
                        {options.map((opt, idx) => (
                          <label key={idx} className="inline-flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`q_${q.id}`}
                              value={opt}
                              checked={answers[q.id] === opt}
                              onChange={() => handleChange(q.id, opt)}
                              className="form-radio h-5 w-5 text-blue-500 focus:ring-blue-300"
                            />
                            <span className="text-gray-800">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyView;
