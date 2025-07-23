import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const Modal = ({ show, title, children, onConfirm, onCancel }) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-opacity-50"
      onClick={onCancel}
    >
      <div
        className="
          bg-gray-800 text-white
          rounded-xl shadow-xl
          w-11/12 sm:w-10/12 md:w-2/3 lg:w-1/2 max-w-lg
          max-h-[90vh] overflow-y-auto
          p-4 sm:p-6
        "
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <header className="mb-4 border-b border-gray-700 pb-2">
            <h2 className="text-xl sm:text-2xl font-semibold">
              {title}
            </h2>
          </header>
        )}
        <div className="mb-6 text-gray-200">
          {children}
        </div>
        <footer className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onCancel}
            className="
              w-full sm:w-auto
              px-4 py-2 rounded-md
              bg-gray-600 hover:bg-gray-700
              text-white
              focus:outline-none focus:ring cursor-pointer
            "
          >
            {t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="
              w-full sm:w-auto
              px-4 py-2 rounded-md
              bg-red-600 hover:bg-red-700
              text-white
              focus:outline-none focus:ring cursor-pointer
            "
          >
            {t('confirm')}
          </button>
        </footer>
      </div>
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  title: null,
  children: null,
};

export default Modal;
