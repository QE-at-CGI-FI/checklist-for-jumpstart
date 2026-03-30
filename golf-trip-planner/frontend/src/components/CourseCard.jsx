export default function CourseCard({ course, onAddToTrip, onViewDetails }) {
  const stars = '★'.repeat(Math.round(course.rating || 0)) + '☆'.repeat(5 - Math.round(course.rating || 0));

  return (
    <div style={{ border: '1px solid #c8e6c9', borderRadius: 8, padding: '1rem', background: '#f9fffe' }}>
      <h3 style={{ margin: '0 0 0.25rem' }}>{course.name}</h3>
      <div style={{ color: '#b8860b', fontSize: '1.1rem' }}>{stars}
        <span style={{ color: '#555', fontSize: '0.85rem', marginLeft: 6 }}>
          {course.rating?.toFixed(1)} ({course.ratingCount ?? '?'} reviews)
        </span>
      </div>
      <p style={{ margin: '0.4rem 0', color: '#444', fontSize: '0.9rem' }}>📍 {course.address}</p>
      {course.phone && <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>📞 {course.phone}</p>}
      {course.website && (
        <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>
          🌐 <a href={course.website} target="_blank" rel="noopener noreferrer">Website</a>
        </p>
      )}
      {course.openingHours?.length > 0 && (
        <details style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
          <summary style={{ cursor: 'pointer', color: '#2d6a2d' }}>Opening hours</summary>
          <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1rem' }}>
            {course.openingHours.map(h => <li key={h}>{h}</li>)}
          </ul>
        </details>
      )}
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: 8 }}>
        {onViewDetails && <button onClick={onViewDetails}>Details</button>}
        {onAddToTrip && <button onClick={() => onAddToTrip(course)} style={{ background: '#2d6a2d', color: '#fff', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>+ Add to Trip</button>}
      </div>
    </div>
  );
}
