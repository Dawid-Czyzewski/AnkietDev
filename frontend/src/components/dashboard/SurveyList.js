import { useTranslation } from 'react-i18next';

const SurveyList = ({
  surveys,
  loading,
  error,
  onView,
  onEdit,
  onDelete,
  onCreate,
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
          {t('your_surveys')}
        </h1>
        <button
          onClick={onCreate}
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-center cursor-pointer"
        >
          {t('create_new')}
        </button>
      </div>

      {loading && <p>{t('loading')}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && surveys.length === 0 && (
        <p>{t('no_surveys')}</p>
      )}

      {!loading && !error && surveys.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {surveys.map((s) => (
            <div
              key={s.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold mb-2 text-white">
                {s.title}
              </h2>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={() => onView(s)}
                  className="w-full sm:w-auto px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded cursor-pointer"
                >
                  {t('view')}
                </button>
                <button
                  onClick={() => onEdit(s)}
                  className="w-full sm:w-auto px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded cursor-pointer"
                >
                  {t('edit')}
                </button>
                <button
                  onClick={() => onDelete(s.id)}
                  className="w-full sm:w-auto px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded cursor-pointer"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyList;
