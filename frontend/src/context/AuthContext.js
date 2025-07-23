import { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiService } from '../services/apiService';

const AuthContext = createContext({
  user: null,
  login: async (email, password) => false,
  logout: async () => false,
});

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiService.login({ email, password });
      const u = { user_id: data.user_id, email: data.email };
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
      toast.success(t('login_success'));
      return true;
    } catch (err) {
      const msg = err.isNetworkError
        ? t('network_error')
        : err.message || t('login_error');
      toast.error(msg);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      localStorage.removeItem('user');
      toast.success(t('logoutSuccess'));
      navigate('/', { replace: true });
      return true;
    } catch (err) {
      const msg = err.isNetworkError
        ? t('network_error')
        : err.message || t('logout_error');
      toast.error(msg);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
