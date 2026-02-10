import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { backendServices, handleApiError } from '../services/api';

const TABS = ['events', 'workshops', 'products'];

function Admin() {
  const { t } = useTranslation();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('events');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (!authLoading && user && !isAdmin) {
      navigate('/');
      return;
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    const fetch = tab === 'events' ? backendServices.getEvents :
      tab === 'workshops' ? backendServices.getWorkshops : backendServices.getProducts;
    fetch()
      .then((res) => setItems(res?.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [tab, isAdmin]);

  const getFields = () => {
    if (tab === 'events') return ['title', 'description', 'date', 'time', 'location', 'category', 'organizer', 'is_free', 'price'];
    if (tab === 'workshops') return ['title', 'description', 'date', 'time', 'price', 'category', 'max_participants', 'location', 'instructor_name'];
    return ['name', 'description', 'price', 'category', 'stock_quantity', 'sustainability_rating'];
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      if (tab === 'events') await backendServices.deleteEvent(id);
      if (tab === 'workshops') await backendServices.deleteWorkshop(id);
      if (tab === 'products') await backendServices.deleteProduct(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setMessage({ type: 'success', text: t('common.success') });
    } catch (err) {
      setMessage({ type: 'error', text: handleApiError(err).message });
    }
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setForm({ ...item });
  };

  const handleSave = async () => {
    try {
      const id = editing;
      if (tab === 'events') await backendServices.updateEvent(id, form);
      if (tab === 'workshops') await backendServices.updateWorkshop(id, form);
      if (tab === 'products') await backendServices.updateProduct(id, form);
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...form } : i)));
      setEditing(null);
      setMessage({ type: 'success', text: t('common.success') });
    } catch (err) {
      setMessage({ type: 'error', text: handleApiError(err).message });
    }
  };

  const handleCreate = async () => {
    try {
      let res;
      if (tab === 'events') res = await backendServices.createEvent(form);
      if (tab === 'workshops') res = await backendServices.createWorkshop(form);
      if (tab === 'products') res = await backendServices.createProduct(form);
      const newItem = res?.data;
      if (newItem) setItems((prev) => [newItem, ...prev]);
      setForm({});
      setMessage({ type: 'success', text: t('common.success') });
    } catch (err) {
      setMessage({ type: 'error', text: handleApiError(err).message });
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="container mx-auto px-4 py-8" aria-label={t('admin.title')}>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{t('admin.title')}</h1>
      {message.text && (
        <div
          className={`mb-4 px-4 py-2 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}
          role="alert"
        >
          {message.text}
        </div>
      )}
      <div className="flex gap-2 mb-6" role="tablist" aria-label={t('admin.title')}>
        {TABS.map((tabsKey) => (
          <button
            key={tabsKey}
            type="button"
            role="tab"
            aria-selected={tab === tabsKey}
            onClick={() => setTab(tabsKey)}
            className={`px-4 py-2 rounded-lg font-medium ${tab === tabsKey ? 'bg-eco-green text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {t(`admin.${tabsKey}`)}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-gray-600">{t('common.loading')}</p>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {getFields().map((field) => (
              <input
                key={field}
                type={field === 'is_free' ? 'checkbox' : field === 'date' || field === 'time' ? field : field === 'price' || field === 'stock_quantity' || field === 'max_participants' || field === 'sustainability_rating' ? 'number' : 'text'}
                placeholder={field}
                value={field === 'is_free' ? undefined : form[field] ?? ''}
                checked={field === 'is_free' ? !!form[field] : undefined}
                onChange={(e) => setForm((prev) => ({ ...prev, [field]: field === 'is_free' ? e.target.checked : e.target.value }))}
                className="border rounded px-2 py-1 text-sm"
                aria-label={field}
              />
            ))}
            <button type="button" onClick={handleCreate} className="bg-eco-green text-white px-4 py-2 rounded-lg text-sm">
              {t('admin.add')}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300" role="table">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-2 py-1 text-left">ID</th>
                  {getFields().slice(0, 4).map((f) => (
                    <th key={f} className="border border-gray-300 px-2 py-1 text-left">{f}</th>
                  ))}
                  <th className="border border-gray-300 px-2 py-1 text-left">{t('admin.edit')}</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">{t('admin.delete')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 px-2 py-1">{item.id}</td>
                    {getFields().slice(0, 4).map((f) => (
                      <td key={f} className="border border-gray-300 px-2 py-1">{String(item[f] ?? '')}</td>
                    ))}
                    <td className="border border-gray-300 px-2 py-1">
                      <button type="button" onClick={() => handleEdit(item)} className="text-eco-green underline">{t('admin.edit')}</button>
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <button type="button" onClick={() => handleDelete(item.id)} className="text-red-600 underline">{t('admin.delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {editing && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10" role="dialog" aria-modal="true" aria-label={t('admin.edit')}>
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-lg font-bold mb-4">{t('admin.edit')}</h2>
                {getFields().map((field) => (
                  <label key={field} className="block mb-2">
                    <span className="text-sm text-gray-600">{field}</span>
                    {field === 'is_free' ? (
                      <input
                        type="checkbox"
                        checked={!!form[field]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.checked }))}
                        className="ml-2"
                      />
                    ) : (
                      <input
                        type={field === 'date' || field === 'time' ? field : 'text'}
                        value={form[field] ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                        className="w-full border rounded px-2 py-1"
                      />
                    )}
                  </label>
                ))}
                <div className="flex gap-2 mt-4">
                  <button type="button" onClick={handleSave} className="bg-eco-green text-white px-4 py-2 rounded-lg">{t('admin.save')}</button>
                  <button type="button" onClick={() => setEditing(null)} className="bg-gray-200 px-4 py-2 rounded-lg">{t('admin.cancel')}</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Admin;
