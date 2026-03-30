import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import CourseCard from '../components/CourseCard';

export default function CourseSearch() {
  const api = useApi();
  const navigate = useNavigate();
  const [query, setQuery] = useState({ location: '', radius: 50, rating: '' });
  const [results, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.searchCourses({ location: query.location, radius: query.radius, rating: query.rating || undefined });
      setCourses(data?.courses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Find Golf Courses</h1>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input
          required
          placeholder="Location (e.g. Tallinn, Estonia)"
          value={query.location}
          onChange={e => setQuery(q => ({ ...q, location: e.target.value }))}
          style={{ flex: '1 1 240px' }}
        />
        <input
          type="number" min={1} max={200}
          placeholder="Radius (km)"
          value={query.radius}
          onChange={e => setQuery(q => ({ ...q, radius: e.target.value }))}
          style={{ width: 110 }}
        />
        <input
          type="number" min={1} max={5} step={0.1}
          placeholder="Min rating"
          value={query.rating}
          onChange={e => setQuery(q => ({ ...q, rating: e.target.value }))}
          style={{ width: 110 }}
        />
        <button type="submit" disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {results.map(course => (
            <CourseCard key={course.id} course={course} onViewDetails={() => navigate(`/search/${course.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
