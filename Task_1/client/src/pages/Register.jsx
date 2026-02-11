import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import { checkApiHealth } from '../services/api';

function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', full_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    checkApiHealth().then(setApiAvailable);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      const msg = err.message || 'Registration failed';
      const isUnreachable = !err.response && (msg.includes('Network') || msg.includes('fetch') || msg === 'Server error occurred');
      setError(isUnreachable ? t('auth.apiRequired') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md" aria-label={t('auth.register')}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-2">
          {t('auth.register')}
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
            label={t('auth.fullName')}
            name="full_name"
            type="text"
            value={form.full_name}
            onChange={handleChange}
            required
            autoComplete="name"
            id="register-fullname"
          />
          <FormInput
            label={t('auth.username')}
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
            id="register-username"
          />
          <FormInput
            label={t('auth.email')}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            id="register-email"
          />
          <FormInput
            label={t('auth.password')}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            id="register-password"
          />
          <button
            type="submit"
            disabled={loading || !apiAvailable}
            className="w-full bg-eco-green text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 transition-colors"
          >
            {loading ? t('common.loading') : t('auth.register')}
          </button>
        </form>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          {t('auth.login')}{' '}
          <Link to="/login" className="text-eco-green font-medium hover:underline">
            {t('nav.login')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
