export default function WeatherWidget({ days }) {
  if (!days?.length) return null;

  return (
    <div style={{ border: '1px solid #b3d7ff', borderRadius: 8, padding: '1rem', background: '#f0f7ff', marginTop: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>Weather Forecast</h3>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
        {days.map(day => (
          <div key={day.date} style={{ minWidth: 90, textAlign: 'center', padding: '0.5rem', background: '#fff', borderRadius: 6, border: '1px solid #cde', fontSize: '0.82rem' }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{formatDate(day.date)}</div>
            {day.conditionIcon && <img src={`https:${day.conditionIcon}`} alt={day.condition} width={36} />}
            <div>{day.maxTempC}° / {day.minTempC}°C</div>
            <div style={{ color: '#2255aa' }}>💧 {day.chanceOfRain}%</div>
            <div style={{ color: '#555' }}>💨 {day.windKph} km/h</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' });
}
