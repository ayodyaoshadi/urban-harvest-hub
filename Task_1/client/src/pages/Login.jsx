import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import { checkApiHealth } from '../services/api';

function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    checkApiHealth().then(setApiAvailable);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      const from = location.state?.from;
      const bookingState = location.state?.bookingState;
      if (from === '/booking' && bookingState) {
        navigate('/booking', { state: bookingState });
      } else {
        navigate(from || '/', { replace: true });
      }
    } catch (err) {
      const msg = err.message || t('auth.invalidCredentials');
      const isUnreachable = !err.response && (msg.includes('Network') || msg.includes('fetch') || msg === 'Server error occurred');
      setError(isUnreachable ? t('auth.apiRequired') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md" aria-label={t('auth.login')}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-2">
          {t('auth.login')}
        </h1>
        {!apiAvailable && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200 rounded-lg text-sm" role="status">
            {t('auth.apiRequired')}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg" role="alert">
              {error}
            </div>
          )}
          <FormInput
            label={t('auth.username')}
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <FormInput
            label={t('auth.password')}
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={loading || !apiAvailable}
            className="w-full bg-eco-green text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 transition-colors"
          >
            {loading ? t('common.loading') : t('auth.login')}
          </button>
        </form>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          {t('auth.register')}{' '}
          <Link to="/register" className="text-eco-green font-medium hover:underline">
            {t('nav.register')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
