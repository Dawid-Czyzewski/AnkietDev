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

  if (loading) return <div className="p-6 text-center">{t('loading')}</div>;
  if (error) return <div className="p-6 text-red-600 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center">{survey.title}</h1>

        {survey.questions.map(q => (
          <div key={q.id}>
            <label className="block font-medium text-gray-700 mb-2">
              {q.orderNumber}. {q.text}
            </label>
            {q.type === 'open' && (
              <textarea
                rows={4}
                value={answers[q.id] || ''}
                onChange={e => handleChange(q.id, e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            )}
            {q.type === 'select' && (
              <select
                value={answers[q.id] || ''}
                onChange={e => handleChange(q.id, e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="" disabled>{t('choose_option')}</option>
                {q.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            {q.type === 'radio' && (
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <label key={i} className="flex flex-wrap gap-2 ">
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={e => handleChange(q.id, e.target.value)}
                      className="form-radio text-blue-600"
                    />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="text-center">
          <button
            type="submit"
            disabled={submitting}
            className={`w-full sm:w-auto px-6 py-3 rounded-md text-white font-semibold transition ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 cursor-pointer hover:bg-purple-700'
            }`}
          >
            {submitting ? t('submitting') : t('submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Survey;
