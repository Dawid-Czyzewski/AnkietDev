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
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7f50',
  '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb'
];

const SurveyStatsDetail = ({ surveyId }) => {
  const { t } = useTranslation();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [expanded, setExpanded] = useState({});

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

  if (loading) return <div className="p-6">{t('loading')}</div>;
  if (error)   return <div className="p-6 text-red-500">{error}</div>;
  if (!survey) return <div className="p-6">{t('survey_not_found')}</div>;

  const toggle = id => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-white">{survey.title}</h2>

      {survey.questions.length === 0 ? (
        <p className="text-gray-300">{t('no_questions')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {survey.questions.map(q => {
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
                className="bg-gray-800 p-4 rounded-lg shadow flex flex-col h-full"
              >
                <div
                  className={`flex justify-between items-center ${q.type === 'open' ? 'cursor-pointer' : ''}`}
                  onClick={() => q.type === 'open' && toggle(q.id)}
                >
                  <h3 className="text-lg font-medium text-white">{q.text}</h3>
                  {q.type === 'open' && (
                    expanded[q.id]
                      ? <ChevronUpIcon className="h-5 w-5 text-gray-300" />
                      : <ChevronDownIcon className="h-5 w-5 text-gray-300" />
                  )}
                </div>

                {q.type === 'open' ? (
                  expanded[q.id] ? (
                    total > 0 ? (
                      <div className="mt-3 bg-gray-700 p-3 rounded flex-1 overflow-auto">
                        <p className="text-sm text-gray-400 mb-2">
                          {t('total_responses')}: {total}
                        </p>
                        <div className="space-y-2">
                          {answers.map((a, i) => (
                            <p key={i} className="text-gray-100 border-b border-gray-600 pb-1">
                              {a.text}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-gray-400">{t('no_responses')}</p>
                    )
                  ) : null
                ) : (
                  total > 0 ? (
                    <div className="mt-4 flex-1">
                      <p className="text-sm text-gray-400 mb-2">
                        {t('total_responses')}: {total}
                      </p>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius="80%"
                            innerRadius="40%"
                            labelLine={false}
                            label={({ name, value, count }) => `${name}: ${value}% (${count})`}
                          >
                            {chartData.map((_, idx) => (
                              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            ))}
                            <LabelList dataKey="value" position="inside" formatter={val => `${val}%`} />
                          </Pie>
                          <Tooltip formatter={(val, _, payload) => {
                            const cnt = payload?.payload?.count;
                            return [`${val}% (${cnt})`, payload?.name];
                          }} />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="mt-3 text-gray-400">{t('no_responses')}</p>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SurveyStatsDetail;
