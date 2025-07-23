import { useContext }   from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext }  from '../context/AuthContext';

const RedirectIfAuth = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (user) {
    return <Navigate to="../dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export default RedirectIfAuth;
