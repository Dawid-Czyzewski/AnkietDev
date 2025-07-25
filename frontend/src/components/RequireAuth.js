import { useContext }      from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext }     from '../context/AuthContext';

const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="../" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
