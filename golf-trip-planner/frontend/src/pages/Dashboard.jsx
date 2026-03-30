import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

export default function Dashboard() {
  const api = useApi();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '' });

  useEffect(() => {
    api.getTrips()
      .then(data => setTrips(data?.trips || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const data = await api.createTrip({ name: form.name, startDate: form.startDate, endDate: form.endDate });
      setTrips(prev => [data.trip, ...prev]);
      setShowCreate(false);
      setForm({ name: '', startDate: '', endDate: '' });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await api.deleteTrip(id);
      setTrips(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading trips…</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Golf Trips</h1>
        <button onClick={() => setShowCreate(true)}>+ New Trip</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {showCreate && (
        <form onSubmit={handleCreate} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: 6, marginBottom: '1rem' }}>
          <h3>Create New Trip</h3>
          <label>Name<br />
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
          </label>
          <label>Start Date<br />
            <input type="date" required value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} style={{ marginRight: 8 }} />
          </label>
          <label>End Date<br />
            <input type="date" required value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
          </label>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: 8 }}>
            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </form>
      )}

      {trips.length === 0
        ? <p>No trips yet. Create your first golf trip above!</p>
        : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {trips.map(trip => (
              <li key={trip.id} style={{ border: '1px solid #ddd', borderRadius: 6, padding: '1rem', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Link to={`/trips/${trip.id}`} style={{ fontWeight: 600, fontSize: '1.05rem' }}>{trip.name}</Link>
                  {trip.start_date && <span style={{ marginLeft: 12, color: '#555' }}>{trip.start_date} → {trip.end_date}</span>}
                </div>
                <button onClick={() => handleDelete(trip.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
