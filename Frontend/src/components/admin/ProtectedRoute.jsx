import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../ui/Loader';

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;