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
    <div className="min-h-screen p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-indigo-900/10"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              {t('your_surveys')}
            </h1>
            <p className="text-gray-400 text-lg">
              {t('manage_surveys_subtitle')}
            </p>
          </div>
          
          <button
            onClick={onCreate}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border border-purple-500/30 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 overflow-hidden cursor-pointer w-full sm:w-auto"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            
            <div className="relative z-10 flex items-center justify-center space-x-3 w-full whitespace-nowrap">
              <span className="text-xl transition-transform duration-300 group-hover:scale-110 flex-shrink-0">✨</span>
              <span className="text-white font-semibold transition-all duration-300 group-hover:text-white/90 whitespace-nowrap text-lg">
                {t('create_new')}
              </span>
            </div>
            
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">{t('loading')}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && surveys.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('no_surveys_title')}</h3>
              <p className="text-gray-400 mb-6">{t('no_surveys_desc')}</p>
              <button
                onClick={onCreate}
                className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border border-purple-500/30 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                {t('create_first_survey')}
              </button>
            </div>
          </div>
        )}

        {!loading && !error && surveys.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((s, index) => {
              const createdDate = new Date(s.createdDate);
              const expireDate = s.expireDate ? new Date(s.expireDate) : null;
              const isExpired = expireDate && expireDate < new Date();
              const totalAnswers = (s.questions || []).reduce((acc, q) => acc + (q.answers?.length || 0), 0);
              
              return (
                <div
                  key={s.id}
                  className="group relative backdrop-blur-xl bg-gray-800/30 border border-white/10 rounded-2xl p-6 hover:bg-gray-800/40 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden flex flex-col h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  
                  <div className="absolute top-4 right-4">
                    {isExpired ? (
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    ) : expireDate ? (
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    ) : (
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
                        {s.title}
                      </h2>
                      
                      <div className="flex items-center justify-between mb-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <span>📝</span>
                          <span>{t('questions_count', { count: s.questions?.length || 0 })}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <span>👥</span>
                          <span>{t('responses_count_short', { count: totalAnswers })}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{t('created')}</span>
                          <span>{createdDate.toLocaleDateString('pl-PL')}</span>
                        </div>
                        {expireDate && (
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{t('expires')}</span>
                            <span className={isExpired ? 'text-red-400' : 'text-yellow-400'}>
                              {expireDate.toLocaleDateString('pl-PL')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => onView(s)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/40 hover:to-cyan-600/40 border border-blue-500/30 backdrop-blur-md rounded-xl text-blue-300 hover:text-blue-200 font-medium transition-all duration-300 hover:scale-105 cursor-pointer text-sm"
                      >
                        👁️ {t('view')}
                      </button>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(s)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 hover:from-yellow-600/40 hover:to-orange-600/40 border border-yellow-500/30 backdrop-blur-md rounded-lg text-yellow-300 hover:text-yellow-200 font-medium transition-all duration-300 hover:scale-105 cursor-pointer text-xs"
                        >
                          ✏️ {t('edit')}
                        </button>
                        <button
                          onClick={() => onDelete(s.id)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/40 hover:to-pink-600/40 border border-red-500/30 backdrop-blur-md rounded-lg text-red-300 hover:text-red-200 font-medium transition-all duration-300 hover:scale-105 cursor-pointer text-xs"
                        >
                          🗑️ {t('delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyList;
