import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendContactForm } from '../services/contactService';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await sendContactForm(formData);
      if (!response.success) {
        throw new Error(t('contact_error'));
      } else {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section className="relative bg-gray-900 text-gray-100 overflow-hidden min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-blue-900 opacity-60"></div>
      <div className="relative container mx-auto px-4 max-w-xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center">
          {t('contact_title')}
        </h2>
        <form onSubmit={status === 'loading' ? e => e.preventDefault() : handleSubmit} className="space-y-6 bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200">
              {t('contact_name')}
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-3"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              {t('contact_email')}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-200">
              {t('contact_message')}
            </label>
            <textarea
              name="message"
              id="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-gray-100 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {status === 'loading' ? t('submitting') : t('submit')}
          </button>
          {status === 'success' && (
            <p className="text-green-400 text-center mt-4">{t('contact_success')}</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-center mt-4">{t('contact_error')}</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;
