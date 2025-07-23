import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import SurveyList from './SurveyList';
import SurveyView from './SurveyView';
import SurveyEdit from './SurveyEdit';
import SurveyCreate from './SurveyCreate';
import Modal from '../modals/Modal';
import { surveyService } from '../../services/surveyService';
import { localSurveyService } from '../../services/localSurveyService';

const Overview = () => {
  const { t } = useTranslation();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState('list');
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ show: false, surveyId: null });

  useEffect(() => {
    (async () => {
      try {
        const remoteSurveys = await surveyService.list();
        const localSurveys = localSurveyService.getAll();
        setSurveys([...localSurveys, ...remoteSurveys]);
      } catch (err) {
        console.error(err);
        setError(t('failed_fetch'));
        setSurveys(localSurveyService.getAll());
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);

  const goToList = () => {
    setSelectedSurvey(null);
    setPage('list');
  };
  const goToView = survey => {
    setSelectedSurvey(survey);
    setPage('view');
  };
  const goToEdit = survey => {
    setSelectedSurvey(survey);
    setPage('edit');
  };
  const goToCreate = () => {
    setSelectedSurvey(null);
    setPage('create');
  };

  const confirmDelete = id => {
    setDeleteModal({ show: true, surveyId: id });
  };

  const handleModalCancel = () => {
    setDeleteModal({ show: false, surveyId: null });
  };

  const handleModalConfirm = async () => {
    const id = deleteModal.surveyId;
    const isLocal = String(id).startsWith('local-');
    try {
      if (isLocal) {
        localSurveyService.remove(id);
      } else {
        await surveyService.delete(id);
      }
      setSurveys(prev => prev.filter(s => s.id !== id));
      toast.success(t('deleted_successfully'));
    } catch (err) {
      console.error(err);
      toast.error(t('failed_delete'));
    } finally {
      handleModalCancel();
    }
  };

  const handleCreate = async survey => {
    setSurveys(prev => [survey, ...prev]);
    toast.success(t('created_successfully'));
    goToList();
  };

  const handleUpdate = async survey => {
    setSurveys(prev => prev.map(s => (s.id === survey.id ? survey : s)));
    goToList();
  };

  const content = (() => {
    switch (page) {
      case 'view':
        return <SurveyView survey={selectedSurvey} onBack={goToList} />;
      case 'edit':
        return <SurveyEdit survey={selectedSurvey} onBack={goToList} onSave={handleUpdate} />;
      case 'create':
        return <SurveyCreate onBack={goToList} onSave={handleCreate} />;
      default:
        return (
          <SurveyList
            surveys={surveys}
            loading={loading}
            error={error}
            onView={goToView}
            onEdit={goToEdit}
            onDelete={confirmDelete}
            onCreate={goToCreate}
          />
        );
    }
  })();

  return (
    <>
      {content}

      <Modal
        show={deleteModal.show}
        title={t('confirm_delete_title')}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      >
        <p>{t('confirm_delete_message')}</p>
      </Modal>
    </>
  );
};

export default Overview;
