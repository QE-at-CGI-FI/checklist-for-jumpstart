import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav style={{ background: '#2d6a2d', color: '#fff', padding: '0.75rem 1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <Link to="/" style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>⛳ Golf Trip Planner</Link>
      {token && (
        <>
          <Link to="/search" style={{ color: '#d4edda', textDecoration: 'none' }}>Find Courses</Link>
          <button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #d4edda', color: '#d4edda', cursor: 'pointer', borderRadius: 4, padding: '0.25rem 0.75rem' }}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
