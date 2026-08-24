import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import API from '../utils/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pinVerified, setPinVerified] = useState(() => {
    return sessionStorage.getItem('adminPinVerified') === 'true';
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get('/auth/me');

        setAdmin(res.data.data);

        const verified =
          sessionStorage.getItem('adminPinVerified') === 'true';

        setPinVerified(verified);
      } catch {
        localStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminPinVerified');

        setAdmin(null);
        setPinVerified(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', {
      email,
      password,
    });

    localStorage.setItem(
      'adminToken',
      res.data.data.token
    );

    sessionStorage.removeItem('adminPinVerified');

    setAdmin(res.data.data);
    setPinVerified(false);

    return res.data;
  };

  const verifyPin = async (pin) => {
    const res = await API.post('/auth/verify-pin', {
      pin,
    });

    sessionStorage.setItem(
      'adminPinVerified',
      'true'
    );

    setPinVerified(true);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminPinVerified');

    setAdmin(null);
    setPinVerified(false);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        pinVerified,
        login,
        verifyPin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
