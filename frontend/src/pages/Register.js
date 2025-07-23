import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService } from '../services/apiService';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.email) errs.email = t('validation_email_required');
    if (!formData.password) errs.password = t('validation_password_required');
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = t('validation_password_match');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      await apiService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success(t('register_success'));
      navigate('/login');
    } catch (err) {
      let msg;
      if (err.isNetworkError) {
        msg = t('network_error');
      } else {
        msg = err.message || t('register_error');
      }
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {t('register')}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-gray-800 p-8 rounded-lg shadow-lg space-y-6"
        >
          {['email', 'password', 'confirmPassword'].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-200"
              >
                {t(field)}
              </label>
              <input
                type={
                  field === 'password' || field === 'confirmPassword'
                    ? 'password'
                    : 'text'
                }
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-purple-600 focus:border-purple-600 transition"
              />
              {errors[field] && (
                <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
              )}
            </div>
          ))}

          {serverError && (
            <p className="mt-1 text-xs text-red-500">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? t('registering') : t('register')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
